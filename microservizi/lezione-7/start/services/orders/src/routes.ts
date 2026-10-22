import type { FastifyInstance } from "fastify";
import type { OrderItem, OrderLine, OrderStore } from "./store.js";
import { CatalogUnavailableError, type CatalogClient } from "./catalog-client.js";
import { createOrderSchema } from "./schemas.js";
import type { OrderEvents } from "./events.js";

interface CreateOrderBody {
  customerEmail: string;
  items: OrderItem[];
}

interface Deps {
  store: OrderStore;
  catalog: CatalogClient;
  retryAfterSeconds?: number;
  events?: OrderEvents;
}

export async function orderRoutes(app: FastifyInstance, { store, catalog, retryAfterSeconds = 10, events }: Deps): Promise<void> {
  app.get("/orders", async () => store.list());

  app.get<{ Params: { id: string } }>("/orders/:id", async (request, reply) => {
    const order = store.get(request.params.id);
    if (!order) return reply.code(404).send({ error: "Ordine non trovato" });
    return order;
  });

  app.post<{ Body: CreateOrderBody }>(
    "/orders",
    { schema: { body: createOrderSchema } },
    async (request, reply) => {
      const { customerEmail, items } = request.body;
      // Il correlation ID di questa richiesta viaggia anche nelle chiamate a catalog.
      const ctx = { requestId: request.id };

      try {
        // CUCITURA 1, ora via HTTP: nome e prezzo li chiediamo a catalog.
        const lines: OrderLine[] = [];
        for (const item of items) {
          const product = await catalog.getProduct(item.productId, ctx);
          if (!product) {
            return reply.code(422).send({ error: `Prodotto ${item.productId} inesistente` });
          }
          lines.push({
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            unitPriceCents: product.priceCents,
          });
        }

        // CUCITURA 2, ora via HTTP: catalog toglie le scorte in modo atomico.
        for (const line of lines) {
          const result = await catalog.reserve(line.productId, line.quantity, ctx);
          if (result.status !== "reserved") {
            // ATTENZIONE: se questa è la seconda riga, la prima è già stata prenotata
            // e resta tolta dalle scorte. Senza una transazione unica tra due servizi
            // serve una "compensazione": esercizio extra 1, e la Saga nella lezione 8.
            return reply.code(409).send({ error: `Scorte insufficienti per ${line.productName}` });
          }
        }

        const order = store.create(customerEmail, lines);

        // CUCITURA 3, ora un EVENTO: orders racconta che l'ordine esiste.
        // L'email la manda notifications, quando vuole; orders non aspetta e non sa chi ascolta.
        // Parte 2 · TODO 3: se c'è "events", pubblica l'evento:
        //   await events.orderCreated(order, request.id)   (request.id = il correlation ID)
        //   dentro un try/catch. Se fallisce, l'ordine resta confermato: scrivi un log di errore
        //   ("evento OrderCreated NON pubblicato") e rispondi 201 lo stesso.
        void events;
        request.log.info(`Email di conferma a ${customerEmail} per l'ordine ${order.id}`);

        return reply.code(201).header("Location", `/orders/${order.id}`).send(order);
      } catch (err) {
        if (err instanceof CatalogUnavailableError) {
          // Senza catalog non possiamo confermare: 503 Service Unavailable.
          // Log strutturato: campi separati, facili da filtrare.
          request.log.error({ reason: err.kind, detail: err.message }, "catalog non disponibile");
          if (err.kind === "circuit_open") {
            // Diciamo al client quando ha senso riprovare.
            reply.header("Retry-After", String(retryAfterSeconds));
          }
          return reply.code(503).send({ error: "Catalogo non disponibile, riprova più tardi", reason: err.kind });
        }
        throw err;
      }
    },
  );
}

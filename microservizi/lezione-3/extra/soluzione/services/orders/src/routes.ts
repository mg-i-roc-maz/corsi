import type { FastifyInstance } from "fastify";
import type { OrderItem, OrderLine, OrderStore } from "./store.js";
import { CatalogUnavailableError, type CatalogClient } from "./catalog-client.js";
import { createOrderSchema } from "./schemas.js";

interface CreateOrderBody {
  customerEmail: string;
  items: OrderItem[];
}

interface Deps {
  store: OrderStore;
  catalog: CatalogClient;
}

export async function orderRoutes(app: FastifyInstance, { store, catalog }: Deps): Promise<void> {
  // Rilascia le prenotazioni già fatte. Se anche il rilascio fallisce, lo scriviamo
  // nel log: qualcuno dovrà sistemarlo a mano (o un processo automatico, lezione 8).
  async function compensate(lines: OrderLine[]): Promise<void> {
    for (const line of lines) {
      try {
        await catalog.release(line.productId, line.quantity);
      } catch (err) {
        app.log.error(`Compensazione fallita per ${line.productId} x${line.quantity}: ${(err as Error).message}`);
      }
    }
  }

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

      try {
        // Extra 2: UNA chiamata per tutti i prodotti, invece di una per riga.
        const products = await catalog.getProducts(items.map((i) => i.productId));
        const byId = new Map(products.map((p) => [p.id, p]));
        const lines: OrderLine[] = [];
        for (const item of items) {
          const product = byId.get(item.productId);
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

        // Extra 1: se una prenotazione fallisce, annulliamo quelle già fatte (compensazione).
        const reserved: OrderLine[] = [];
        for (const line of lines) {
          let result;
          try {
            result = await catalog.reserve(line.productId, line.quantity);
          } catch (err) {
            await compensate(reserved);
            throw err;
          }
          if (result.status !== "reserved") {
            await compensate(reserved);
            return reply.code(409).send({ error: `Scorte insufficienti per ${line.productName}` });
          }
          reserved.push(line);
        }

        const order = store.create(customerEmail, lines);

        // CUCITURA 3: la notifica è ancora un log. Nella lezione 7 diventerà un evento.
        request.log.info(`Email di conferma a ${customerEmail} per l'ordine ${order.id}`);

        return reply.code(201).header("Location", `/orders/${order.id}`).send(order);
      } catch (err) {
        if (err instanceof CatalogUnavailableError) {
          // Senza catalog non possiamo confermare: 503 Service Unavailable.
          request.log.error(err.message);
          return reply.code(503).send({ error: "Catalogo non disponibile, riprova più tardi" });
        }
        throw err;
      }
    },
  );
}

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
        // Parte 2 · TODO 3: costruisci le righe dell'ordine chiedendo a catalog.
        // 1. Per ogni item: catalog.getProduct(item.productId).
        //    Non esiste? Rispondi 422 con { error: "Prodotto <id> inesistente" }.
        //    Esiste? Aggiungi a "lines" una riga con productId, productName, quantity, unitPriceCents.
        // 2. Per ogni riga: catalog.reserve(line.productId, line.quantity).
        //    Esito diverso da "reserved"? Rispondi 409 con { error: "Scorte insufficienti per <nome>" }.
        // Il try/catch qui sotto trasforma già "catalog non risponde" in 503.
        const lines: OrderLine[] = [];
        void items;

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

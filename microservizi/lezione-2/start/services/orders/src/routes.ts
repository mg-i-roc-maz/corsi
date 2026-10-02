import type { FastifyInstance } from "fastify";
import type { OrderItem, OrderStore } from "./store.js";
import { createOrderSchema } from "./schemas.js";

interface CreateOrderBody {
  customerEmail: string;
  items: OrderItem[];
}

export async function orderRoutes(app: FastifyInstance, { store }: { store: OrderStore }): Promise<void> {
  app.get("/orders", async () => store.list());

  app.get<{ Params: { id: string } }>("/orders/:id", async (request, reply) => {
    const order = store.get(request.params.id);
    if (!order) return reply.code(404).send({ error: "Ordine non trovato" });
    return order;
  });

  // Nel monolite qui c'erano le tre CUCITURE con il catalogo.
  // Ora orders non può più leggere i prodotti: accetta l'ordine come "pending".
  // CUCITURE 1 e 2 (prezzi e scorte) -> lezione 3, chiamata HTTP a catalog.
  // CUCITURA 3 (email di conferma)   -> lezione 7, evento su RabbitMQ.
  app.post<{ Body: CreateOrderBody }>(
    "/orders",
    { schema: { body: createOrderSchema } },
    async (request, reply) => {
      const order = store.create(request.body.customerEmail, request.body.items);
      return reply.code(201).header("Location", `/orders/${order.id}`).send(order);
    },
  );
}

import type { FastifyInstance } from "fastify";
import { db, type Order, type OrderLine } from "../db.js";

// Modulo ORDINI del monolite.
// Guarda i commenti "CUCITURA": sono i punti in cui gli ordini dipendono
// direttamente dal catalogo. Nella lezione 3 diventeranno chiamate HTTP.

interface CreateOrderBody {
  customerEmail: string;
  items: { productId: string; quantity: number }[];
}

const createOrderSchema = {
  type: "object",
  required: ["customerEmail", "items"],
  additionalProperties: false,
  properties: {
    customerEmail: { type: "string", format: "email" },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["productId", "quantity"],
        additionalProperties: false,
        properties: {
          productId: { type: "string" },
          quantity: { type: "integer", minimum: 1 },
        },
      },
    },
  },
} as const;

export async function orderRoutes(app: FastifyInstance): Promise<void> {
  app.get("/orders", async () => db.orders);

  app.get<{ Params: { id: string } }>("/orders/:id", async (request, reply) => {
    const order = db.orders.find((o) => o.id === request.params.id);
    if (!order) return reply.code(404).send({ error: "Ordine non trovato" });
    return order;
  });

  app.post<{ Body: CreateOrderBody }>(
    "/orders",
    { schema: { body: createOrderSchema } },
    async (request, reply) => {
    const { customerEmail, items } = request.body;
    const lines: OrderLine[] = [];

    for (const item of items) {
      // CUCITURA 1: leggo il prodotto direttamente dai dati del catalogo.
      const product = db.products.find((p) => p.id === item.productId);
      if (!product) {
        return reply.code(400).send({ error: `Prodotto ${item.productId} inesistente` });
      }
      if (product.stock < item.quantity) {
        return reply.code(409).send({ error: `Scorte insufficienti per ${product.name}` });
      }
      lines.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
      });
    }

    // CUCITURA 2: modifico le scorte del catalogo dall'interno degli ordini.
    for (const line of lines) {
      const product = db.products.find((p) => p.id === line.productId)!;
      product.stock -= line.quantity;
    }

    const order: Order = {
      id: `o-${db.counters.order++}`,
      customerEmail,
      lines,
      totalCents: lines.reduce((sum, l) => sum + l.quantity * l.unitPriceCents, 0),
      createdAt: new Date().toISOString(),
    };
    db.orders.push(order);

    // CUCITURA 3: la "notifica" parte in modo sincrono, nello stesso processo.
    // Nella lezione 7 diventerà un evento OrderCreated su RabbitMQ.
    app.log.info(`📧 Email di conferma a ${customerEmail} per l'ordine ${order.id}`);

    return reply.code(201).send(order);
  },
  );
}

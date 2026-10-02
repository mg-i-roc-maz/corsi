import type { FastifyInstance } from "fastify";
import { db, type Product } from "../db.js";

// Modulo CATALOGO del monolite.

export async function catalogRoutes(app: FastifyInstance): Promise<void> {
  app.get("/products", async () => db.products);

  app.get<{ Params: { id: string } }>("/products/:id", async (request, reply) => {
    const product = db.products.find((p) => p.id === request.params.id);
    if (!product) return reply.code(404).send({ error: "Prodotto non trovato" });
    return product;
  });

  app.post<{ Body: Omit<Product, "id"> }>("/products", async (request, reply) => {
    const product: Product = { id: `p-${db.counters.product++}`, ...request.body };
    db.products.push(product);
    return reply.code(201).send(product);
  });
}

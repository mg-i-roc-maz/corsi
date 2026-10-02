import type { FastifyInstance } from "fastify";
import type { ProductInput, ProductStore } from "./store/index.js";
import { idParamSchema, productInputSchema } from "./schemas.js";

type IdParams = { id: string };
type ListQuery = { q?: string };

// Le rotte ricevono l'archivio come opzione del plugin: non sanno quale database c'è sotto.
export async function productRoutes(app: FastifyInstance, { store }: { store: ProductStore }): Promise<void> {
  // GET /products?q=tastiera -> elenco (filtrabile per nome)
  app.get<{ Querystring: ListQuery }>("/products", async (request) => {
    return store.list(request.query.q);
  });

  // GET /products/:id -> un prodotto, oppure 404
  app.get<{ Params: IdParams }>(
    "/products/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const product = await store.get(request.params.id);
      if (!product) {
        return reply.code(404).send({ error: "Prodotto non trovato" });
      }
      return product;
    },
  );

  // POST /products -> crea un prodotto: 201 Created + header Location
  app.post<{ Body: ProductInput }>(
    "/products",
    { schema: { body: productInputSchema } },
    async (request, reply) => {
      const product = await store.create(request.body);
      return reply.code(201).header("Location", `/products/${product.id}`).send(product);
    },
  );

  // PUT /products/:id -> sostituisce un prodotto esistente, oppure 404
  app.put<{ Params: IdParams; Body: ProductInput }>(
    "/products/:id",
    { schema: { params: idParamSchema, body: productInputSchema } },
    async (request, reply) => {
      const product = await store.replace(request.params.id, request.body);
      if (!product) {
        return reply.code(404).send({ error: "Prodotto non trovato" });
      }
      return product;
    },
  );

  // DELETE /products/:id -> 204 No Content, oppure 404
  app.delete<{ Params: IdParams }>(
    "/products/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const deleted = await store.remove(request.params.id);
      if (!deleted) {
        return reply.code(404).send({ error: "Prodotto non trovato" });
      }
      return reply.code(204).send();
    },
  );
}

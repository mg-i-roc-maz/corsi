import type { FastifyInstance } from "fastify";
import * as store from "./store.js";
import { idParamSchema, listQuerySchema, productInputSchema, productPatchSchema } from "./schemas.js";

type IdParams = { id: string };
type ListQuery = { q?: string; sort?: string; limit: number; offset: number };

export async function productRoutes(app: FastifyInstance): Promise<void> {
  // GET /products?q=&sort=&limit=&offset= -> elenco filtrato, ordinato e paginato
  app.get<{ Querystring: ListQuery }>(
    "/products",
    { schema: { querystring: listQuerySchema } },
    async (request, reply) => {
      const { q, sort, limit, offset } = request.query;
      const all = store.list(q);
      if (sort) {
        const desc = sort.startsWith("-");
        const field = desc ? sort.slice(1) : sort;
        all.sort((a, b) => {
          const cmp =
            field === "price" ? a.priceCents - b.priceCents : a.name.localeCompare(b.name, "it");
          return desc ? -cmp : cmp;
        });
      }
      reply.header("X-Total-Count", all.length);
      return all.slice(offset, offset + limit);
    },
  );

  // PATCH /products/:id -> aggiorna solo i campi inviati
  app.patch<{ Params: IdParams; Body: Partial<store.ProductInput> }>(
    "/products/:id",
    { schema: { params: idParamSchema, body: productPatchSchema } },
    async (request, reply) => {
      const product = store.patch(request.params.id, request.body);
      if (!product) {
        return reply.code(404).send({ error: "Prodotto non trovato" });
      }
      return product;
    },
  );

  // GET /products/:id -> un prodotto, oppure 404
  app.get<{ Params: IdParams }>(
    "/products/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const product = store.get(request.params.id);
      if (!product) {
        return reply.code(404).send({ error: "Prodotto non trovato" });
      }
      return product;
    },
  );

  // POST /products -> crea un prodotto: 201 Created + header Location
  app.post<{ Body: store.ProductInput }>(
    "/products",
    { schema: { body: productInputSchema } },
    async (request, reply) => {
      const product = store.create(request.body);
      return reply.code(201).header("Location", `/products/${product.id}`).send(product);
    },
  );

  // PUT /products/:id -> sostituisce un prodotto esistente, oppure 404
  app.put<{ Params: IdParams; Body: store.ProductInput }>(
    "/products/:id",
    { schema: { params: idParamSchema, body: productInputSchema } },
    async (request, reply) => {
      const product = store.replace(request.params.id, request.body);
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
      const deleted = store.remove(request.params.id);
      if (!deleted) {
        return reply.code(404).send({ error: "Prodotto non trovato" });
      }
      return reply.code(204).send();
    },
  );
}

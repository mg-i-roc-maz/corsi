import type { FastifyInstance } from "fastify";
import type { ProductInput, ProductStore } from "./store/index.js";
import { idParamSchema, productInputSchema, reservationSchema } from "./schemas.js";
import type { ProductCache } from "./product-cache.js";

type IdParams = { id: string };
type ListQuery = { q?: string };

// Le rotte ricevono l'archivio e la cache come opzioni del plugin.
export async function productRoutes(
  app: FastifyInstance,
  { store, productCache }: { store: ProductStore; productCache: ProductCache },
): Promise<void> {
  // GET /products?q=tastiera -> elenco (filtrabile per nome)
  app.get<{ Querystring: ListQuery }>("/products", async (request) => {
    return store.list(request.query.q);
  });

  // GET /products/:id -> un prodotto, oppure 404
  app.get<{ Params: IdParams }>(
    "/products/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      // CACHE-ASIDE: prima la cache, poi (se serve) il database.
      const { product, cache } = await productCache.getProduct(store, request.params.id);
      // X-Cache dice al client da dove arriva la risposta: HIT, MISS o BYPASS.
      reply.header("X-Cache", cache);
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
      // Parte 4 · TODO 2: il prodotto è cambiato. Cosa va fatto alla sua copia in cache?
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
      // Parte 4 · TODO 3: il prodotto non esiste più. E la sua copia in cache?
      return reply.code(204).send();
    },
  );

  // POST /products/:id/reservations -> prenota scorte (rotta INTERNA, la usa orders)
  // 200 con il prodotto aggiornato, 404 se non esiste, 409 se le scorte non bastano.
  // Il gateway non la espone: un cliente non deve poter togliere scorte da solo.
  app.post<{ Params: IdParams; Body: { quantity: number } }>(
    "/products/:id/reservations",
    { schema: { params: idParamSchema, body: reservationSchema } },
    async (request, reply) => {
      const result = await store.reserve(request.params.id, request.body.quantity);
      if (result.status === "not_found") {
        return reply.code(404).send({ error: "Prodotto non trovato" });
      }
      if (result.status === "insufficient_stock") {
        return reply.code(409).send({ error: "Scorte insufficienti", available: result.available });
      }
      // Parte 4 · TODO 4: le scorte sono cambiate. Anche qui...
      return result.product;
    },
  );
}

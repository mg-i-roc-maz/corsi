import type { FastifyInstance } from "fastify";
import type { ProductInput, ProductStore } from "./store/index.js";
import { idParamSchema, productInputSchema, reservationSchema } from "./schemas.js";
import type { ProductCache } from "./product-cache.js";
import { noStore, sendCacheable } from "./http-cache.js";

type IdParams = { id: string };
type ListQuery = { q?: string };

// Le rotte ricevono l'archivio e la cache come opzioni del plugin.
export async function productRoutes(
  app: FastifyInstance,
  {
    store,
    productCache,
    httpMaxAgeSeconds,
    staleWhileRevalidateSeconds = 0,
  }: { store: ProductStore; productCache: ProductCache; httpMaxAgeSeconds: number; staleWhileRevalidateSeconds?: number },
): Promise<void> {
  // Le risposte delle scritture e gli errori non si tengono in cache da nessuna parte.
  app.addHook("onSend", async (request, reply) => {
    if (request.method !== "GET" || reply.statusCode >= 400) noStore(reply);
  });

  // GET /products?q=tastiera -> elenco (filtrabile per nome)
  // Cache HTTP: il gateway e il browser possono tenerlo httpMaxAgeSeconds.
  app.get<{ Querystring: ListQuery }>("/products", async (request, reply) => {
    return sendCacheable(request, reply, await store.list(request.query.q), httpMaxAgeSeconds, staleWhileRevalidateSeconds);
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
      // Cache HTTP: Cache-Control + ETag, e 304 se il client ha già questa versione.
      return sendCacheable(request, reply, product, httpMaxAgeSeconds, staleWhileRevalidateSeconds);
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
      // Il prodotto è cambiato: la copia in cache è vecchia, va buttata.
      await productCache.invalidate(request.params.id, "updated");
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
      await productCache.invalidate(request.params.id, "deleted");
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
      // Le scorte sono cambiate: invalidiamo anche qui.
      await productCache.invalidate(request.params.id, "stock");
      return result.product;
    },
  );
}

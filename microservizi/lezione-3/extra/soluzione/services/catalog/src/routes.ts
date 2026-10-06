import type { FastifyInstance } from "fastify";
import type { ProductInput, ProductStore } from "./store/index.js";
import { idParamSchema, productInputSchema, reservationSchema } from "./schemas.js";

type IdParams = { id: string };
type ListQuery = { q?: string; ids?: string };

// Le rotte ricevono l'archivio come opzione del plugin: non sanno quale database c'è sotto.
export async function productRoutes(app: FastifyInstance, { store }: { store: ProductStore }): Promise<void> {
  // GET /products?q=tastiera -> elenco (filtrabile per nome)
  // Extra 2: GET /products?ids=p-1,p-2 restituisce solo quei prodotti, in una chiamata.
  app.get<{ Querystring: ListQuery }>("/products", async (request) => {
    if (request.query.ids) {
      const ids = request.query.ids.split(",").map((id) => id.trim()).filter(Boolean);
      return store.getMany(ids);
    }
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
      return result.product;
    },
  );

  // Extra 1: POST /products/:id/releases -> restituisce scorte (rotta INTERNA)
  app.post<{ Params: IdParams; Body: { quantity: number } }>(
    "/products/:id/releases",
    { schema: { params: idParamSchema, body: reservationSchema } },
    async (request, reply) => {
      const product = await store.release(request.params.id, request.body.quantity);
      if (!product) return reply.code(404).send({ error: "Prodotto non trovato" });
      return product;
    },
  );

  // Extra 4: versione 2 di un prodotto. Il prezzo cambia FORMA: è una modifica
  // incompatibile, quindi va in una nuova versione e la v1 resta com'era.
  app.get<{ Params: IdParams }>(
    "/v2/products/:id",
    { schema: { params: idParamSchema } },
    async (request, reply) => {
      const product = await store.get(request.params.id);
      if (!product) return reply.code(404).send({ error: "Prodotto non trovato" });
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: { amount: product.priceCents / 100, currency: "EUR" },
        available: product.stock > 0,
      };
    },
  );
}

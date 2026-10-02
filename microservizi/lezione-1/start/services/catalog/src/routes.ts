import type { FastifyInstance } from "fastify";
import * as store from "./store.js";
import { idParamSchema, productInputSchema } from "./schemas.js";

type IdParams = { id: string };
type ListQuery = { q?: string };

// Le funzioni per leggere e scrivere i prodotti sono in store.ts:
//   store.list(q)  store.get(id)  store.create(input)  store.replace(id, input)  store.remove(id)
// Gli schemi di validazione sono in schemas.ts.
// Quando hai finito, lancia `npm test`: tutti i test devono essere verdi.

export async function productRoutes(app: FastifyInstance): Promise<void> {
  // ESEMPIO GIÀ FATTO
  // GET /products?q=tastiera -> elenco (filtrabile per nome)
  app.get<{ Querystring: ListQuery }>("/products", async (request) => {
    return store.list(request.query.q);
  });

  // TODO 1: GET /products/:id
  // - usa store.get(request.params.id)
  // - se il prodotto non esiste: reply.code(404).send({ error: "Prodotto non trovato" })
  // - altrimenti restituisci il prodotto
  app.get<{ Params: IdParams }>(
    "/products/:id",
    { schema: { params: idParamSchema } },
    async (_request, reply) => {
      return reply.code(501).send({ error: "TODO 1: da implementare" });
    },
  );

  // TODO 2: POST /products
  // - lo schema productInputSchema valida già il body (risponde 400 se non è valido)
  // - crea il prodotto con store.create(request.body)
  // - rispondi 201 con l'header Location: /products/<id>
  //   suggerimento: reply.code(201).header("Location", ...).send(product)
  app.post<{ Body: store.ProductInput }>(
    "/products",
    { schema: { body: productInputSchema } },
    async (_request, reply) => {
      return reply.code(501).send({ error: "TODO 2: da implementare" });
    },
  );

  // TODO 3: PUT /products/:id
  // - usa store.replace(id, body): restituisce undefined se il prodotto non esiste
  // - 404 se non esiste, altrimenti il prodotto aggiornato
  app.put<{ Params: IdParams; Body: store.ProductInput }>(
    "/products/:id",
    { schema: { params: idParamSchema, body: productInputSchema } },
    async (_request, reply) => {
      return reply.code(501).send({ error: "TODO 3: da implementare" });
    },
  );

  // TODO 4: DELETE /products/:id
  // - usa store.remove(id): restituisce false se il prodotto non esiste
  // - 404 se non esiste, altrimenti 204 senza corpo: reply.code(204).send()
  app.delete<{ Params: IdParams }>(
    "/products/:id",
    { schema: { params: idParamSchema } },
    async (_request, reply) => {
      return reply.code(501).send({ error: "TODO 4: da implementare" });
    },
  );
}

// Test del client HTTP: un piccolo server finge di essere catalog
// e controlliamo che il client traduca bene ogni risposta.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import Fastify from "fastify";
import { createHttpCatalogClient, CatalogUnavailableError } from "../src/catalog-client.js";

const fake = Fastify();
fake.get("/products/p-1", async () => ({ id: "p-1", name: "Tastiera", description: "", priceCents: 8990, stock: 2 }));
fake.get("/products/p-500", async (_req, reply) => reply.code(500).send({ error: "boom" }));
fake.post<{ Body: { quantity: number } }>("/products/p-1/reservations", async (req, reply) =>
  req.body.quantity > 2 ? reply.code(409).send({ error: "Scorte insufficienti", available: 2 }) : { id: "p-1" },
);
let baseUrl = "";

before(async () => {
  await fake.listen({ port: 0, host: "127.0.0.1" }); // porta 0: ne sceglie una libera
  const address = fake.server.address();
  baseUrl = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;
});
after(() => fake.close());

test("getProduct: 200 diventa il prodotto, 404 diventa undefined", async () => {
  const client = createHttpCatalogClient(baseUrl);
  assert.equal((await client.getProduct("p-1"))?.priceCents, 8990);
  assert.equal(await client.getProduct("p-2"), undefined);
});

test("reserve: 200 diventa reserved, 409 diventa insufficient_stock", async () => {
  const client = createHttpCatalogClient(baseUrl);
  assert.deepEqual(await client.reserve("p-1", 1), { status: "reserved" });
  assert.deepEqual(await client.reserve("p-1", 3), { status: "insufficient_stock", available: 2 });
  assert.deepEqual(await client.reserve("p-2", 1), { status: "not_found" });
});

test("un 500 di catalog diventa CatalogUnavailableError", async () => {
  await assert.rejects(createHttpCatalogClient(baseUrl).getProduct("p-500"), CatalogUnavailableError);
});

test("catalog spento: CatalogUnavailableError", async () => {
  // Sulla porta 1 non ascolta nessuno: la connessione viene rifiutata.
  await assert.rejects(createHttpCatalogClient("http://127.0.0.1:1").getProduct("p-1"), CatalogUnavailableError);
});

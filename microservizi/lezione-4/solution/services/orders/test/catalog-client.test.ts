// Test del client HTTP verso catalog. Un piccolo server Fastify finge di essere
// catalog, e da ogni test possiamo decidere come si comporta: lento, rotto, sano.
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import Fastify from "fastify";
import { createHttpCatalogClient, CatalogUnavailableError } from "../src/catalog-client.js";

// Come si comporta il finto catalog nel prossimo test
const fake = { delayMs: 0, failNext: 0, gets: 0, posts: 0, lastRequestId: "" as string | undefined };

const server = Fastify();
server.addHook("onRequest", async (request) => {
  fake.lastRequestId = request.headers["x-request-id"] as string | undefined;
  if (fake.delayMs) await new Promise((r) => setTimeout(r, fake.delayMs));
});
server.get("/products/:id", async (request, reply) => {
  fake.gets++;
  if (fake.failNext > 0) {
    fake.failNext--;
    return reply.code(500).send({ error: "boom" });
  }
  const { id } = request.params as { id: string };
  if (id !== "p-1") return reply.code(404).send({ error: "Prodotto non trovato" });
  return { id: "p-1", name: "Tastiera", description: "", priceCents: 8990, stock: 2 };
});
server.post("/products/:id/reservations", async (request, reply) => {
  fake.posts++;
  if (fake.failNext > 0) {
    fake.failNext--;
    return reply.code(500).send({ error: "boom" });
  }
  const { quantity } = request.body as { quantity: number };
  return quantity > 2 ? reply.code(409).send({ error: "Scorte insufficienti", available: 2 }) : { id: "p-1" };
});

let baseUrl = "";
before(async () => {
  await server.listen({ port: 0, host: "127.0.0.1" }); // porta 0: una libera qualsiasi
  const address = server.server.address();
  baseUrl = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;
});
after(() => server.close());
beforeEach(() => Object.assign(fake, { delayMs: 0, failNext: 0, gets: 0, posts: 0, lastRequestId: "" }));

// Opzioni piccole, così i test sono veloci
const client = (extra = {}) =>
  createHttpCatalogClient({ baseUrl, timeoutMs: 200, retries: 2, retryBaseMs: 10, ...extra });

// ---- Il contratto (come nella lezione 3)

test("contratto: 200 diventa il prodotto, 404 diventa undefined", async () => {
  assert.equal((await client().getProduct("p-1"))?.priceCents, 8990);
  assert.equal(await client().getProduct("p-2"), undefined);
});

test("contratto: reserve traduce 200 e 409", async () => {
  assert.deepEqual(await client().reserve("p-1", 1), { status: "reserved" });
  assert.deepEqual(await client().reserve("p-1", 3), { status: "insufficient_stock", available: 2 });
});

test("catalog spento: CatalogUnavailableError", async () => {
  await assert.rejects(
    createHttpCatalogClient({ baseUrl: "http://127.0.0.1:1", retries: 0 }).getProduct("p-1"),
    CatalogUnavailableError,
  );
});

// ---- 1. Timeout

test("timeout: un catalog lento viene abbandonato dopo timeoutMs", async () => {
  fake.delayMs = 1000;
  const started = Date.now();
  await assert.rejects(client({ retries: 0 }).getProduct("p-1"), (err: CatalogUnavailableError) => err.kind === "timeout");
  assert.ok(Date.now() - started < 600, "deve arrendersi molto prima del secondo di attesa");
});

// ---- 2. Retry

test("retry: una lettura fallita viene ripetuta e alla fine riesce", async () => {
  fake.failNext = 2; // due 500, poi una risposta buona
  const product = await client().getProduct("p-1");
  assert.equal(product?.id, "p-1");
  assert.equal(fake.gets, 3);
});

test("retry: dopo retries tentativi in più ci si arrende", async () => {
  fake.failNext = 10;
  await assert.rejects(client({ retries: 2 }).getProduct("p-1"), CatalogUnavailableError);
  assert.equal(fake.gets, 3); // 1 + 2 tentativi in più
});

test("retry: una prenotazione (POST) NON viene mai ripetuta", async () => {
  fake.failNext = 1;
  await assert.rejects(client().reserve("p-1", 1), CatalogUnavailableError);
  assert.equal(fake.posts, 1);
});

// ---- 3. Circuit breaker

test("circuit breaker: dopo troppi errori il circuito si apre e catalog non viene più chiamato", async () => {
  fake.failNext = 100;
  const c = client({ retries: 0, breaker: { errorThresholdPercentage: 50, volumeThreshold: 3, resetTimeoutMs: 60_000 } });
  for (let i = 0; i < 3; i++) await assert.rejects(c.getProduct("p-1"));
  assert.equal(c.circuitState?.(), "open");
  const callsBefore = fake.gets;
  await assert.rejects(c.getProduct("p-1"), (err: CatalogUnavailableError) => err.kind === "circuit_open");
  assert.equal(fake.gets, callsBefore, "a circuito aperto catalog non deve ricevere chiamate");
});

test("circuit breaker: 404 e 409 non sono guasti e non aprono il circuito", async () => {
  const c = client({ retries: 0, breaker: { errorThresholdPercentage: 50, volumeThreshold: 3, resetTimeoutMs: 60_000 } });
  for (let i = 0; i < 5; i++) {
    await c.getProduct("p-404");
    await c.reserve("p-1", 99);
  }
  assert.equal(c.circuitState?.(), "closed");
});

test("circuit breaker: dopo resetTimeout una chiamata di prova riuscita richiude il circuito", async () => {
  fake.failNext = 3;
  const c = client({ retries: 0, breaker: { errorThresholdPercentage: 50, volumeThreshold: 3, resetTimeoutMs: 100 } });
  for (let i = 0; i < 3; i++) await assert.rejects(c.getProduct("p-1"));
  assert.equal(c.circuitState?.(), "open");
  await new Promise((r) => setTimeout(r, 150));
  assert.equal((await c.getProduct("p-1"))?.id, "p-1");
  assert.equal(c.circuitState?.(), "closed");
});

// ---- 4. Correlation ID

test("correlation ID: l'header x-request-id arriva a catalog", async () => {
  await client().getProduct("p-1", { requestId: "abc-123" });
  assert.equal(fake.lastRequestId, "abc-123");
});

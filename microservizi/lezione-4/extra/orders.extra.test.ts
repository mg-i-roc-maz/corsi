// Test degli esercizi extra della lezione 4 (1, 2 e 4).
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import Fastify from "fastify";
import { createHttpCatalogClient, CatalogUnavailableError } from "../src/catalog-client.js";
import { buildApp } from "../src/app.js";

const fake = { delayMs: 0, down: false };
const server = Fastify();
server.get("/products/:id", async (_request, reply) => {
  if (fake.delayMs) await new Promise((r) => setTimeout(r, fake.delayMs));
  if (fake.down) return reply.code(500).send({ error: "boom" });
  return { id: "p-1", name: "Tastiera", priceCents: 8990, stock: 2 };
});
let baseUrl = "";
before(async () => {
  await server.listen({ port: 0, host: "127.0.0.1" });
  const address = server.server.address();
  baseUrl = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;
});
after(() => server.close());
beforeEach(() => Object.assign(fake, { delayMs: 0, down: false }));

test("Extra 1: /health/ready mostra i numeri del circuito", async () => {
  const catalog = createHttpCatalogClient({ baseUrl, retries: 0 });
  await catalog.getProduct("p-1");
  const res = await buildApp({ catalog }).inject({ method: "GET", url: "/health/ready" });
  const stats = res.json().dependencies.catalog.stats;
  assert.equal(stats.fires, 1);
  assert.equal(stats.successes, 1);
});

test("Extra 2: oltre maxConcurrent chiamate, le nuove sono rifiutate subito", async () => {
  fake.delayMs = 300;
  const catalog = createHttpCatalogClient({ baseUrl, retries: 0, maxConcurrent: 2 });
  const results = await Promise.allSettled([1, 2, 3, 4].map(() => catalog.getProduct("p-1")));
  const busy = results.filter((r) => r.status === "rejected" && (r.reason as CatalogUnavailableError).kind === "too_busy");
  assert.equal(busy.length, 2);
});

test("Extra 4: con catalog giù si usa l'ultimo prodotto noto, se recente", async () => {
  const catalog = createHttpCatalogClient({ baseUrl, retries: 0, fallbackMaxAgeMs: 60_000 });
  assert.equal((await catalog.getProduct("p-1"))?.stale, undefined);
  fake.down = true;
  const product = await catalog.getProduct("p-1");
  assert.equal(product?.priceCents, 8990);
  assert.equal(product?.stale, true);
});

test("Extra 4: senza fallback configurato l'errore resta un errore", async () => {
  const catalog = createHttpCatalogClient({ baseUrl, retries: 0 });
  await catalog.getProduct("p-1");
  fake.down = true;
  await assert.rejects(catalog.getProduct("p-1"), CatalogUnavailableError);
});

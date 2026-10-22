// Test degli esercizi extra della lezione 6, lato orders (2 e 3).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { withLocalCache } from "../src/local-cache.js";
import { fakeCatalog } from "./fake-catalog.js";

test("Extra 2: clear() butta tutte le copie locali", async () => {
  const catalog = withLocalCache(fakeCatalog(), { ttlMs: 60_000 });
  await catalog.getProduct("p-1");
  await catalog.getProduct("p-2");
  catalog.clear();
  assert.equal(catalog.cacheStats().size, 0);
});

test("Extra 3: un ordine è cacheable solo in privato, con ETag e 304", async () => {
  const app = buildApp({ catalog: fakeCatalog() });
  const created = await app.inject({
    method: "POST",
    url: "/orders",
    payload: { customerEmail: "anna@example.com", items: [{ productId: "p-1", quantity: 1 }] },
  });
  const url = `/orders/${created.json().id}`;
  const first = await app.inject({ method: "GET", url });
  assert.equal(first.headers["cache-control"], "private, no-cache");
  const second = await app.inject({ method: "GET", url, headers: { "if-none-match": String(first.headers.etag) } });
  assert.equal(second.statusCode, 304);
});

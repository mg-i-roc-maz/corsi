// Test degli esercizi extra della lezione 5 (1-4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { createMemoryCache, type Cache } from "../src/cache.js";
import { createMemoryStore, type ProductStore } from "../src/store/index.js";

function countingStore(): ProductStore & { reads: number; lists: number } {
  const store = createMemoryStore();
  const counting = { ...store, reads: 0, lists: 0 } as ProductStore & { reads: number; lists: number };
  counting.get = async (id) => {
    counting.reads++;
    return store.get(id);
  };
  counting.list = async (q) => {
    counting.lists++;
    return store.list(q);
  };
  return counting;
}

test("Extra 1: un prodotto inesistente viene ricordato come tale, per poco", async () => {
  const store = countingStore();
  const app = buildApp({ store, negativeTtlSeconds: 10 });
  assert.equal((await app.inject({ method: "GET", url: "/products/p-999" })).statusCode, 404);
  const second = await app.inject({ method: "GET", url: "/products/p-999" });
  assert.equal(second.statusCode, 404);
  assert.equal(second.headers["x-cache"], "HIT");
  assert.equal(store.reads, 1);
});

test("Extra 2: con il jitter i TTL non sono tutti uguali", async () => {
  const ttls: number[] = [];
  const base = createMemoryCache();
  const spy: Cache = { ...base, set: async (k, v, ttl) => void ttls.push(ttl) };
  const app = buildApp({ cache: spy, cacheTtlSeconds: 60, ttlJitterPercent: 10 });
  for (const id of ["p-1", "p-2", "p-3"]) await app.inject({ method: "GET", url: `/products/${id}` });
  for (const ttl of ttls) assert.ok(ttl >= 54 && ttl <= 66, `TTL ${ttl} fuori da 60 ± 10%`);
});

test("Extra 3: la lista va in cache e un prodotto nuovo la invalida", async () => {
  const store = countingStore();
  const app = buildApp({ store });
  await app.inject({ method: "GET", url: "/products" });
  const hit = await app.inject({ method: "GET", url: "/products" });
  assert.equal(hit.headers["x-cache"], "HIT");
  assert.equal(store.lists, 1);
  await app.inject({ method: "POST", url: "/products", payload: { name: "Cuffie", priceCents: 5990, stock: 8 } });
  const after = await app.inject({ method: "GET", url: "/products" });
  assert.equal(after.headers["x-cache"], "MISS");
  assert.equal(after.json().length, 4);
});

test("Extra 4: write-through, dopo una PUT la lettura è già un HIT con il valore nuovo", async () => {
  const app = buildApp();
  await app.inject({ method: "GET", url: "/products/p-2" });
  await app.inject({
    method: "PUT",
    url: "/products/p-2",
    payload: { name: "Mouse wireless", description: "", priceCents: 2990, stock: 30 },
  });
  const res = await app.inject({ method: "GET", url: "/products/p-2" });
  assert.equal(res.headers["x-cache"], "HIT");
  assert.equal(res.json().priceCents, 2990);
});

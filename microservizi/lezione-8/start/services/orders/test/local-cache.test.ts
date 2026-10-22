// Checkpoint della lezione 6, lato orders: la cache locale dei prodotti
// e l'invalidazione quando catalog annuncia ProductChanged.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { withLocalCache } from "../src/local-cache.js";
import { concernsOrders, parseProductChanged } from "../src/invalidation.js";
import { fakeCatalog } from "./fake-catalog.js";

// Un catalog finto che conta le letture
function countingCatalog() {
  const inner = fakeCatalog();
  let reads = 0;
  const original = inner.getProduct.bind(inner);
  inner.getProduct = async (id, ctx) => {
    reads++;
    return original(id, ctx);
  };
  return { inner, reads: () => reads };
}

const order = (productId = "p-1") => ({ customerEmail: "anna@example.com", items: [{ productId, quantity: 1 }] });

test("la seconda lettura dello stesso prodotto non chiama catalog", async () => {
  const { inner, reads } = countingCatalog();
  const catalog = withLocalCache(inner, { ttlMs: 60_000 });
  await catalog.getProduct("p-1");
  await catalog.getProduct("p-1");
  assert.equal(reads(), 1);
  assert.equal(catalog.cacheStats().hits, 1);
});

test("dopo il TTL la copia scade", async () => {
  let now = 0;
  const { inner, reads } = countingCatalog();
  const catalog = withLocalCache(inner, { ttlMs: 60_000, now: () => now });
  await catalog.getProduct("p-1");
  now = 61_000;
  await catalog.getProduct("p-1");
  assert.equal(reads(), 2);
});

test("con TTL 0 la cache è spenta", async () => {
  const { inner, reads } = countingCatalog();
  const catalog = withLocalCache(inner, { ttlMs: 0 });
  await catalog.getProduct("p-1");
  await catalog.getProduct("p-1");
  assert.equal(reads(), 2);
});

test("le prenotazioni vanno sempre a catalog", async () => {
  const { inner } = countingCatalog();
  const catalog = withLocalCache(inner, { ttlMs: 60_000 });
  await catalog.reserve("p-2", 1);
  await catalog.reserve("p-2", 1);
  assert.equal(inner.products.get("p-2")?.stock, 28);
});

test("senza invalidazione, il secondo ordine usa il prezzo VECCHIO", async () => {
  const { inner } = countingCatalog();
  const app = buildApp({ catalog: withLocalCache(inner, { ttlMs: 60_000 }) });
  await app.inject({ method: "POST", url: "/orders", payload: order() });
  inner.products.get("p-1")!.priceCents = 7990; // il prezzo cambia in catalog
  const second = await app.inject({ method: "POST", url: "/orders", payload: order() });
  assert.equal(second.json().lines[0].unitPriceCents, 8990);
});

test("dopo ProductChanged il prossimo ordine usa il prezzo NUOVO", async () => {
  const { inner } = countingCatalog();
  const catalog = withLocalCache(inner, { ttlMs: 60_000 });
  const app = buildApp({ catalog });
  await app.inject({ method: "POST", url: "/orders", payload: order() });
  inner.products.get("p-1")!.priceCents = 7990;
  catalog.invalidate("p-1"); // quello che fa l'avviso di catalog
  const second = await app.inject({ method: "POST", url: "/orders", payload: order() });
  assert.equal(second.json().lines[0].unitPriceCents, 7990);
  assert.equal(catalog.cacheStats().invalidations, 1);
});

test("GET /cache/stats mostra hit, miss e invalidazioni", async () => {
  const { inner } = countingCatalog();
  const app = buildApp({ catalog: withLocalCache(inner, { ttlMs: 60_000 }) });
  await app.inject({ method: "POST", url: "/orders", payload: order() });
  await app.inject({ method: "POST", url: "/orders", payload: order() });
  const stats = (await app.inject({ method: "GET", url: "/cache/stats" })).json();
  assert.equal(stats.hits, 1);
  assert.equal(stats.misses, 1);
});

test("gli avvisi di catalog: si capisce solo ProductChanged con un productId", () => {
  assert.deepEqual(parseProductChanged('{"type":"ProductChanged","productId":"p-1","change":"stock","at":"2026-10-20T10:00:00Z"}'), {
    productId: "p-1",
    change: "stock",
  });
  assert.equal(parseProductChanged('{"type":"Altro","productId":"p-1"}'), undefined);
  assert.equal(parseProductChanged("non json"), undefined);
});

test("un avviso senza change vale come updated: nel dubbio si butta la copia", () => {
  assert.deepEqual(parseProductChanged('{"type":"ProductChanged","productId":"p-2"}'), { productId: "p-2", change: "updated" });
});

test("un cambio di scorte non riguarda orders; prezzo e cancellazione sì", () => {
  assert.equal(concernsOrders({ productId: "p-1", change: "stock" }), false);
  assert.equal(concernsOrders({ productId: "p-1", change: "updated" }), true);
  assert.equal(concernsOrders({ productId: "p-1", change: "deleted" }), true);
});

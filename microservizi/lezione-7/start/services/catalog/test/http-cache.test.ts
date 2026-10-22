// Checkpoint della lezione 6: cache HTTP, stampede e invalidazione tra servizi.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { createMemoryNotifier } from "../src/notifier.js";
import { createMemoryStore, type ProductStore } from "../src/store/index.js";

const get = (app: ReturnType<typeof buildApp>, id = "p-1", headers: Record<string, string> = {}) =>
  app.inject({ method: "GET", url: `/products/${id}`, headers });

const tastiera = { name: "Tastiera meccanica", description: "", priceCents: 7990, stock: 12 };

// ---------------------------------------------------------------- Parte 1: Cache-Control ed ETag

test("GET di un prodotto: Cache-Control public con max-age, ed ETag", async () => {
  const app = buildApp({ httpMaxAgeSeconds: 10 });
  const res = await get(app);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["cache-control"], "public, max-age=10");
  assert.match(String(res.headers.etag), /^".+"$/);
});

test("If-None-Match con la stessa ETag: 304 senza corpo", async () => {
  const app = buildApp();
  const first = await get(app);
  const second = await get(app, "p-1", { "if-none-match": String(first.headers.etag) });
  assert.equal(second.statusCode, 304);
  assert.equal(second.body, "");
});

test("dopo una PUT l'ETag cambia: la vecchia non vale più", async () => {
  const app = buildApp();
  const before = await get(app);
  await app.inject({ method: "PUT", url: "/products/p-1", payload: tastiera });
  const after = await get(app, "p-1", { "if-none-match": String(before.headers.etag) });
  assert.equal(after.statusCode, 200);
  assert.notEqual(after.headers.etag, before.headers.etag);
  assert.equal(after.json().priceCents, 7990);
});

test("errori e scritture: Cache-Control no-store", async () => {
  const app = buildApp();
  assert.equal((await get(app, "p-999")).headers["cache-control"], "no-store");
  const put = await app.inject({ method: "PUT", url: "/products/p-1", payload: tastiera });
  assert.equal(put.headers["cache-control"], "no-store");
});

test("anche la lista dei prodotti ha Cache-Control ed ETag", async () => {
  const app = buildApp({ httpMaxAgeSeconds: 5 });
  const res = await app.inject({ method: "GET", url: "/products" });
  assert.equal(res.headers["cache-control"], "public, max-age=5");
  assert.ok(res.headers.etag);
});

// ---------------------------------------------------------------- Parte 4: lo stampede

function slowCountingStore(delayMs: number): ProductStore & { reads: number } {
  const store = createMemoryStore();
  const counting = { ...store, reads: 0 } as ProductStore & { reads: number };
  counting.get = async (id) => {
    counting.reads++;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return store.get(id);
  };
  return counting;
}

test("stampede: 20 MISS contemporanei, UNA sola lettura dal database", async () => {
  const store = slowCountingStore(50);
  const app = buildApp({ store });
  const responses = await Promise.all(Array.from({ length: 20 }, () => get(app)));
  assert.ok(responses.every((r) => r.statusCode === 200));
  assert.equal(store.reads, 1);
  const stats = (await app.inject({ method: "GET", url: "/cache/stats" })).json();
  assert.equal(stats.dbReads, 1);
  assert.equal(stats.coalesced, 19);
});

test("stampede: dopo la lettura, la richiesta successiva è un HIT", async () => {
  const store = slowCountingStore(20);
  const app = buildApp({ store });
  await Promise.all([get(app), get(app), get(app)]);
  assert.equal((await get(app)).headers["x-cache"], "HIT");
  assert.equal(store.reads, 1);
});

// ---------------------------------------------------------------- Parte 5: invalidazione tra servizi

test("PUT, DELETE e prenotazione annunciano ProductChanged", async () => {
  const events = createMemoryNotifier();
  const app = buildApp({ events });
  await app.inject({ method: "PUT", url: "/products/p-1", payload: tastiera });
  await app.inject({ method: "POST", url: "/products/p-2/reservations", payload: { quantity: 1 } });
  await app.inject({ method: "DELETE", url: "/products/p-3" });
  assert.deepEqual(events.sent, ["p-1:updated", "p-2:stock", "p-3:deleted"]);
});

test("una lettura non annuncia niente", async () => {
  const events = createMemoryNotifier();
  const app = buildApp({ events });
  await get(app);
  assert.deepEqual(events.sent, []);
});

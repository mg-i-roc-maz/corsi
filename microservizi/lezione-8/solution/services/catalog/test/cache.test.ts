// Checkpoint della lezione 5: cache-aside sui prodotti.
// La cache qui è quella in memoria, con un orologio finto per provare il TTL.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { createMemoryCache, type Cache } from "../src/cache.js";
import { createMemoryStore, type ProductStore } from "../src/store/index.js";

// Un archivio che conta quante volte viene letto
function countingStore(): ProductStore & { reads: number } {
  const store = createMemoryStore();
  const counting = { ...store, reads: 0 } as ProductStore & { reads: number };
  counting.get = async (id) => {
    counting.reads++;
    return store.get(id);
  };
  return counting;
}

const get = (app: ReturnType<typeof buildApp>, id = "p-1") => app.inject({ method: "GET", url: `/products/${id}` });

test("prima lettura MISS, seconda HIT", async () => {
  const app = buildApp();
  assert.equal((await get(app)).headers["x-cache"], "MISS");
  assert.equal((await get(app)).headers["x-cache"], "HIT");
});

test("un HIT non tocca il database", async () => {
  const store = countingStore();
  const app = buildApp({ store });
  await get(app);
  await get(app);
  await get(app);
  assert.equal(store.reads, 1);
});

test("dopo il TTL la copia scade e si torna al database", async () => {
  let now = 0;
  const app = buildApp({ cache: createMemoryCache(() => now), cacheTtlSeconds: 60 });
  await get(app);
  now = 59_000;
  assert.equal((await get(app)).headers["x-cache"], "HIT");
  now = 61_000;
  assert.equal((await get(app)).headers["x-cache"], "MISS");
});

test("PUT invalida la cache: la lettura successiva vede il prezzo nuovo", async () => {
  const app = buildApp();
  await get(app, "p-2"); // ora p-2 è in cache
  await app.inject({
    method: "PUT",
    url: "/products/p-2",
    payload: { name: "Mouse wireless", description: "", priceCents: 2990, stock: 30 },
  });
  const res = await get(app, "p-2");
  // MISS con l'invalidazione; HIT se scegli il write-through (extra 4)
  assert.ok(["MISS", "HIT"].includes(String(res.headers["x-cache"])));
  assert.equal(res.json().priceCents, 2990);
});

test("una prenotazione invalida la cache: le scorte sono aggiornate", async () => {
  const app = buildApp();
  await get(app, "p-3");
  await app.inject({ method: "POST", url: "/products/p-3/reservations", payload: { quantity: 2 } });
  assert.equal((await get(app, "p-3")).json().stock, 3);
});

test("DELETE invalida la cache: il prodotto cancellato non resta in vita", async () => {
  const app = buildApp();
  await get(app, "p-1");
  await app.inject({ method: "DELETE", url: "/products/p-1" });
  assert.equal((await get(app, "p-1")).statusCode, 404);
});

test("cache giù: catalog risponde lo stesso, dal database (BYPASS)", async () => {
  const broken: Cache = {
    get: async () => {
      throw new Error("Redis giù");
    },
    set: async () => {
      throw new Error("Redis giù");
    },
    del: async () => {
      throw new Error("Redis giù");
    },
    ping: async () => {
      throw new Error("Redis giù");
    },
    close: async () => {},
  };
  const app = buildApp({ cache: broken });
  const res = await get(app);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["x-cache"], "BYPASS");
  const ready = await app.inject({ method: "GET", url: "/health/ready" });
  assert.equal(ready.statusCode, 200, "senza cache catalog è più lento, ma pronto");
  assert.equal(ready.json().dependencies.cache, "down");
});

test("GET /cache/stats conta hit e miss", async () => {
  const app = buildApp();
  await get(app);
  await get(app);
  await get(app);
  const stats = (await app.inject({ method: "GET", url: "/cache/stats" })).json();
  assert.equal(stats.hits, 2);
  assert.equal(stats.misses, 1);
  assert.equal(stats.hitRatio, 0.667);
});

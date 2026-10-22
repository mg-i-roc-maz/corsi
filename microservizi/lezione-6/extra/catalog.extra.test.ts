// Test degli esercizi extra della lezione 6, lato catalog (1 e 4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { createMemoryCache, type Cache } from "../src/cache.js";

test("Extra 1: Cache-Control con stale-while-revalidate", async () => {
  const app = buildApp({ httpMaxAgeSeconds: 10, staleWhileRevalidateSeconds: 30 });
  const res = await app.inject({ method: "GET", url: "/products/p-1" });
  assert.equal(res.headers["cache-control"], "public, max-age=10, stale-while-revalidate=30");
});

// Una cache che conta quante volte viene interrogata
function countingCache(): Cache & { gets: number } {
  const inner = createMemoryCache();
  const counting = { ...inner, gets: 0 } as Cache & { gets: number };
  counting.get = async (key) => {
    counting.gets++;
    return inner.get(key);
  };
  return counting;
}

test("Extra 4: con la cache locale, la terza lettura non chiede nemmeno a Redis", async () => {
  const cache = countingCache();
  const app = buildApp({ cache, localTtlMs: 2000 });
  const outcomes = [];
  for (let i = 0; i < 3; i++) {
    outcomes.push((await app.inject({ method: "GET", url: "/products/p-1" })).headers["x-cache"]);
  }
  assert.deepEqual(outcomes, ["MISS", "LOCAL", "LOCAL"]);
  assert.equal(cache.gets, 1);
});

test("Extra 4: una PUT butta anche la copia locale", async () => {
  const app = buildApp({ localTtlMs: 2000 });
  await app.inject({ method: "GET", url: "/products/p-1" });
  await app.inject({
    method: "PUT",
    url: "/products/p-1",
    payload: { name: "Tastiera meccanica", description: "", priceCents: 7990, stock: 12 },
  });
  const res = await app.inject({ method: "GET", url: "/products/p-1" });
  assert.equal(res.headers["x-cache"], "MISS");
  assert.equal(res.json().priceCents, 7990);
});

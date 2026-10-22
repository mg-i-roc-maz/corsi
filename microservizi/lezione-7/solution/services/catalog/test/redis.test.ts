// Test della cache Redis vera. Partono solo se REDIS_URL è impostata, per esempio:
//   REDIS_URL=redis://localhost:6379 npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRedisCache } from "../src/cache.js";

const url = process.env.REDIS_URL;
const skip = !url && "REDIS_URL non impostata";

test("Redis: set con TTL, get e del", { skip }, async () => {
  const cache = createRedisCache({ url: url! });
  try {
    await new Promise((r) => setTimeout(r, 200)); // tempo per collegarsi
    await cache.set("test:chiave", "valore", 10);
    assert.equal(await cache.get("test:chiave"), "valore");
    await cache.del("test:chiave");
    assert.equal(await cache.get("test:chiave"), null);
  } finally {
    await cache.close();
  }
});

test("Redis irraggiungibile: i comandi falliscono subito, non restano appesi", { skip }, async () => {
  const cache = createRedisCache({ url: "redis://127.0.0.1:1" }); // nessuno ascolta sulla porta 1
  const started = Date.now();
  await assert.rejects(cache.get("qualcosa"));
  assert.ok(Date.now() - started < 500, "deve fallire in fretta");
  await cache.close().catch(() => {});
});

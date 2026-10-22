// Test dell'archivio PostgreSQL. Partono solo se DATABASE_URL è impostata,
// per esempio con il database di docker compose:
//   DATABASE_URL=postgres://shop:shop@localhost:5432/catalog npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { createPostgresStore } from "../src/store/index.js";

const url = process.env.DATABASE_URL;

test("PostgreSQL: crea, legge, aggiorna e cancella un prodotto", { skip: !url && "DATABASE_URL non impostata" }, async () => {
  const store = createPostgresStore(url!);
  try {
    const created = await store.create({ name: "Test webcam", description: "", priceCents: 4990, stock: 3 });
    assert.match(created.id, /^p-\d+$/);
    assert.deepEqual(await store.get(created.id), created);

    const found = await store.list("webcam");
    assert.ok(found.some((p) => p.id === created.id));

    const updated = await store.replace(created.id, { ...created, stock: 0 });
    assert.equal(updated?.stock, 0);

    assert.equal(await store.remove(created.id), true);
    assert.equal(await store.get(created.id), undefined);
    assert.equal(await store.remove(created.id), false);
  } finally {
    await store.close();
  }
});

test("PostgreSQL: prenotazioni contemporanee non vanno mai sotto zero", { skip: !url && "DATABASE_URL non impostata" }, async () => {
  const store = createPostgresStore(url!);
  try {
    const created = await store.create({ name: "Test ultimo pezzo", description: "", priceCents: 100, stock: 3 });
    // Dieci ordini partono insieme, ognuno vuole 1 pezzo: solo tre devono riuscire.
    const results = await Promise.all(Array.from({ length: 10 }, () => store.reserve(created.id, 1)));
    assert.equal(results.filter((r) => r.status === "reserved").length, 3);
    assert.equal((await store.get(created.id))?.stock, 0);
    await store.remove(created.id);
  } finally {
    await store.close();
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

test("E1: paginazione con limit, offset e X-Total-Count", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/products?limit=2&offset=1" });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().length, 2);
  assert.equal(res.json()[0].id, "p-2");
  assert.equal(res.headers["x-total-count"], "3");
});

test("E1: limit oltre 50 restituisce 400", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/products?limit=500" });
  assert.equal(res.statusCode, 400);
});

test("E2: ordinamento per prezzo decrescente", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/products?sort=-price" });
  assert.deepEqual(res.json().map((p: { id: string }) => p.id), ["p-3", "p-1", "p-2"]);
});

test("E3: PATCH aggiorna solo i campi inviati", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "PATCH", url: "/products/p-1", payload: { priceCents: 7990 } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().priceCents, 7990);
  assert.equal(res.json().name, "Tastiera meccanica");
});

test("E3: PATCH con body vuoto restituisce 400", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "PATCH", url: "/products/p-1", payload: {} });
  assert.equal(res.statusCode, 400);
});

test("E4: errori in formato uniforme", async () => {
  const app = buildApp();
  const notFound = await app.inject({ method: "GET", url: "/prodotti" });
  assert.equal(notFound.statusCode, 404);
  assert.ok(notFound.json().error);
  const invalid = await app.inject({ method: "POST", url: "/products", payload: { name: "" } });
  assert.equal(invalid.statusCode, 400);
  assert.equal(invalid.json().error, "Dati non validi");
  assert.ok(Array.isArray(invalid.json().details));
});

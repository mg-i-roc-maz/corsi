// Test degli esercizi extra della lezione 3 lato catalog (1, 2 e 4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

test("Extra 1: POST /products/:id/releases restituisce le scorte", async () => {
  const app = buildApp();
  await app.inject({ method: "POST", url: "/products/p-3/reservations", payload: { quantity: 2 } });
  const res = await app.inject({ method: "POST", url: "/products/p-3/releases", payload: { quantity: 2 } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().stock, 5);
  const missing = await app.inject({ method: "POST", url: "/products/p-999/releases", payload: { quantity: 1 } });
  assert.equal(missing.statusCode, 404);
});

test("Extra 2: GET /products?ids= restituisce solo quei prodotti", async () => {
  const res = await buildApp().inject({ method: "GET", url: "/products?ids=p-1,p-3,p-999" });
  assert.deepEqual(res.json().map((p: { id: string }) => p.id), ["p-1", "p-3"]);
});

test("Extra 4: GET /v2/products/:id ha il prezzo in euro, la v1 non cambia", async () => {
  const app = buildApp();
  const v2 = (await app.inject({ method: "GET", url: "/v2/products/p-1" })).json();
  assert.deepEqual(v2.price, { amount: 89.9, currency: "EUR" });
  assert.equal(v2.available, true);
  const v1 = (await app.inject({ method: "GET", url: "/products/p-1" })).json();
  assert.equal(v1.priceCents, 8990);
});

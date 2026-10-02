import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

const valid = { customerEmail: "anna@example.com", items: [{ productId: "p-1", quantity: 2 }] };

test("GET /health risponde ok", async () => {
  const res = await buildApp().inject({ method: "GET", url: "/health" });
  assert.equal(res.json().service, "orders");
});

test("POST /orders crea un ordine pending con 201 e Location", async () => {
  const res = await buildApp().inject({ method: "POST", url: "/orders", payload: valid });
  assert.equal(res.statusCode, 201);
  assert.equal(res.json().status, "pending");
  assert.equal(res.headers.location, `/orders/${res.json().id}`);
});

test("GET /orders/:id restituisce l'ordine creato", async () => {
  const app = buildApp();
  const created = (await app.inject({ method: "POST", url: "/orders", payload: valid })).json();
  const res = await app.inject({ method: "GET", url: `/orders/${created.id}` });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), created);
});

test("GET /orders/:id inesistente restituisce 404", async () => {
  const res = await buildApp().inject({ method: "GET", url: "/orders/o-999" });
  assert.equal(res.statusCode, 404);
});

test("POST /orders senza righe o con quantità 0 restituisce 400", async () => {
  const app = buildApp();
  const empty = await app.inject({ method: "POST", url: "/orders", payload: { ...valid, items: [] } });
  assert.equal(empty.statusCode, 400);
  const zero = await app.inject({
    method: "POST",
    url: "/orders",
    payload: { ...valid, items: [{ productId: "p-1", quantity: 0 }] },
  });
  assert.equal(zero.statusCode, 400);
});

test("POST /orders con email non valida restituisce 400", async () => {
  const res = await buildApp().inject({ method: "POST", url: "/orders", payload: { ...valid, customerEmail: "anna" } });
  assert.equal(res.statusCode, 400);
});

// Checkpoint della lezione 3: orders chiede prezzi e scorte a catalog.
// Qui catalog è finto (test/fake-catalog.ts): i test non hanno bisogno di rete.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { fakeCatalog } from "./fake-catalog.js";

const order = (items: { productId: string; quantity: number }[]) => ({ customerEmail: "anna@example.com", items });

test("GET /health risponde ok", async () => {
  const res = await buildApp({ catalog: fakeCatalog() }).inject({ method: "GET", url: "/health" });
  assert.equal(res.json().service, "orders");
});

test("POST /orders con email non valida o senza righe restituisce 400", async () => {
  const app = buildApp({ catalog: fakeCatalog() });
  const bad = await app.inject({ method: "POST", url: "/orders", payload: { customerEmail: "anna", items: [{ productId: "p-1", quantity: 1 }] } });
  assert.equal(bad.statusCode, 400);
  const empty = await app.inject({ method: "POST", url: "/orders", payload: order([]) });
  assert.equal(empty.statusCode, 400);
});

test("POST /orders conferma l'ordine con nomi e prezzi presi da catalog", async () => {
  const app = buildApp({ catalog: fakeCatalog() });
  const res = await app.inject({ method: "POST", url: "/orders", payload: order([{ productId: "p-1", quantity: 1 }, { productId: "p-2", quantity: 2 }]) });
  assert.equal(res.statusCode, 201);
  const body = res.json();
  assert.equal(body.status, "confirmed");
  assert.equal(body.lines[0].productName, "Tastiera meccanica");
  assert.equal(body.lines[1].unitPriceCents, 3990);
  assert.equal(body.totalCents, 8990 + 2 * 3990);
  assert.equal(res.headers.location, `/orders/${body.id}`);
});

test("POST /orders scala le scorte in catalog", async () => {
  const catalog = fakeCatalog();
  const app = buildApp({ catalog });
  await app.inject({ method: "POST", url: "/orders", payload: order([{ productId: "p-2", quantity: 5 }]) });
  assert.equal(catalog.products.get("p-2")?.stock, 25);
});

test("POST /orders con prodotto inesistente restituisce 422", async () => {
  const res = await buildApp({ catalog: fakeCatalog() }).inject({ method: "POST", url: "/orders", payload: order([{ productId: "p-999", quantity: 1 }]) });
  assert.equal(res.statusCode, 422);
});

test("POST /orders oltre le scorte restituisce 409", async () => {
  const res = await buildApp({ catalog: fakeCatalog() }).inject({ method: "POST", url: "/orders", payload: order([{ productId: "p-3", quantity: 2 }]) });
  assert.equal(res.statusCode, 409);
});

test("l'ultimo monitor va a un solo cliente", async () => {
  const app = buildApp({ catalog: fakeCatalog() });
  const [a, b] = await Promise.all([
    app.inject({ method: "POST", url: "/orders", payload: order([{ productId: "p-3", quantity: 1 }]) }),
    app.inject({ method: "POST", url: "/orders", payload: order([{ productId: "p-3", quantity: 1 }]) }),
  ]);
  assert.deepEqual([a.statusCode, b.statusCode].sort(), [201, 409]);
});

test("POST /orders con catalog spento restituisce 503", async () => {
  const res = await buildApp({ catalog: fakeCatalog({ down: true }) }).inject({ method: "POST", url: "/orders", payload: order([{ productId: "p-1", quantity: 1 }]) });
  assert.equal(res.statusCode, 503);
});

test("GET /orders/:id restituisce l'ordine creato, 404 se non esiste", async () => {
  const app = buildApp({ catalog: fakeCatalog() });
  const created = (await app.inject({ method: "POST", url: "/orders", payload: order([{ productId: "p-1", quantity: 1 }]) })).json();
  const res = await app.inject({ method: "GET", url: `/orders/${created.id}` });
  assert.deepEqual(res.json(), created);
  const missing = await app.inject({ method: "GET", url: "/orders/o-999" });
  assert.equal(missing.statusCode, 404);
});

// Checkpoint della lezione 1: quando tutti questi test sono verdi,
// il servizio catalog è completo. Lancia con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

test("GET /health risponde ok", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/health" });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().status, "ok");
});

test("GET /products restituisce i prodotti iniziali", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/products" });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().length, 3);
});

test("GET /products?q= filtra per nome", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/products?q=mouse" });
  assert.equal(res.json().length, 1);
});

test("GET /products/:id restituisce un prodotto", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/products/p-1" });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().name, "Tastiera meccanica");
});

test("GET /products/:id inesistente restituisce 404", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "GET", url: "/products/p-999" });
  assert.equal(res.statusCode, 404);
});

test("POST /products crea un prodotto con 201 e Location", async () => {
  const app = buildApp();
  const res = await app.inject({
    method: "POST",
    url: "/products",
    payload: { name: "Cuffie", description: "Over-ear", priceCents: 5990, stock: 8 },
  });
  assert.equal(res.statusCode, 201);
  assert.equal(res.headers.location, `/products/${res.json().id}`);
});

test("POST /products con dati non validi restituisce 400", async () => {
  const app = buildApp();
  const res = await app.inject({
    method: "POST",
    url: "/products",
    payload: { name: "", priceCents: -5 },
  });
  assert.equal(res.statusCode, 400);
});

test("PUT /products/:id aggiorna un prodotto", async () => {
  const app = buildApp();
  const res = await app.inject({
    method: "PUT",
    url: "/products/p-2",
    payload: { name: "Mouse wireless", description: "Nuovo modello", priceCents: 3490, stock: 25 },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().priceCents, 3490);
});

test("PUT /products/:id inesistente restituisce 404", async () => {
  const app = buildApp();
  const res = await app.inject({
    method: "PUT",
    url: "/products/p-999",
    payload: { name: "X", priceCents: 100, stock: 1 },
  });
  assert.equal(res.statusCode, 404);
});

test("DELETE /products/:id cancella e poi restituisce 404", async () => {
  const app = buildApp();
  const del = await app.inject({ method: "DELETE", url: "/products/p-3" });
  assert.equal(del.statusCode, 204);
  const again = await app.inject({ method: "GET", url: "/products/p-3" });
  assert.equal(again.statusCode, 404);
});

// ---- Lezione 3: prenotazione delle scorte (rotta interna usata da orders)

test("POST /products/:id/reservations toglie le scorte", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "POST", url: "/products/p-3/reservations", payload: { quantity: 2 } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().stock, 3);
});

test("POST /products/:id/reservations oltre le scorte restituisce 409 e non cambia nulla", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "POST", url: "/products/p-3/reservations", payload: { quantity: 6 } });
  assert.equal(res.statusCode, 409);
  assert.equal(res.json().available, 5);
  const product = await app.inject({ method: "GET", url: "/products/p-3" });
  assert.equal(product.json().stock, 5);
});

test("POST /products/:id/reservations su prodotto inesistente restituisce 404", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "POST", url: "/products/p-999/reservations", payload: { quantity: 1 } });
  assert.equal(res.statusCode, 404);
});

test("POST /products/:id/reservations con quantità 0 restituisce 400", async () => {
  const app = buildApp();
  const res = await app.inject({ method: "POST", url: "/products/p-1/reservations", payload: { quantity: 0 } });
  assert.equal(res.statusCode, 400);
});

// ---- Lezione 4: health check, correlation ID, chaos

test("GET /health/ready controlla il database", async () => {
  const res = await buildApp().inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().dependencies.database, "ok");
});

test("GET /health/ready con database giù risponde 503, /health/live resta 200", async () => {
  const { createMemoryStore } = await import("../src/store/index.js");
  const store = createMemoryStore();
  store.ping = async () => {
    throw new Error("connessione rifiutata");
  };
  const app = buildApp({ store });
  assert.equal((await app.inject({ method: "GET", url: "/health/ready" })).statusCode, 503);
  assert.equal((await app.inject({ method: "GET", url: "/health/live" })).statusCode, 200);
});

test("correlation ID: l'x-request-id ricevuto torna nella risposta", async () => {
  const res = await buildApp().inject({ method: "GET", url: "/products", headers: { "x-request-id": "req-7" } });
  assert.equal(res.headers["x-request-id"], "req-7");
});

test("chaos: con CHAOS_FAIL_PERCENT=100 i prodotti rispondono 503, /health no", async () => {
  const app = buildApp({ chaos: { delayMs: 0, failPercent: 100 } });
  assert.equal((await app.inject({ method: "GET", url: "/products" })).statusCode, 503);
  assert.equal((await app.inject({ method: "GET", url: "/health" })).statusCode, 200);
});

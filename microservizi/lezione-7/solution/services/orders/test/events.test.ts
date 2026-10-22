// Checkpoint della lezione 7, lato orders: un ordine confermato diventa un evento.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { createMemoryPublisher, orderCreatedEvent } from "../src/events.js";
import { fakeCatalog } from "./fake-catalog.js";

const order = (productId = "p-1", quantity = 1) => ({ customerEmail: "anna@example.com", items: [{ productId, quantity }] });

test("un ordine confermato pubblica UN evento OrderCreated", async () => {
  const events = createMemoryPublisher();
  const app = buildApp({ catalog: fakeCatalog(), events });
  const res = await app.inject({ method: "POST", url: "/orders", payload: order() });
  assert.equal(res.statusCode, 201);
  assert.equal(events.published.length, 1);
  const event = events.published[0];
  assert.equal(event.type, "OrderCreated");
  assert.equal(event.data.orderId, res.json().id);
  assert.equal(event.data.customerEmail, "anna@example.com");
  assert.equal(event.data.totalCents, 8990);
});

test("l'evento porta il correlation ID della richiesta", async () => {
  const events = createMemoryPublisher();
  const app = buildApp({ catalog: fakeCatalog(), events });
  const res = await app.inject({ method: "POST", url: "/orders", payload: order(), headers: { "x-request-id": "abc123" } });
  assert.equal(res.headers["x-request-id"], "abc123");
  assert.equal(events.published[0].correlationId, "abc123");
});

test("un ordine rifiutato non pubblica niente", async () => {
  const events = createMemoryPublisher();
  const app = buildApp({ catalog: fakeCatalog(), events });
  const res = await app.inject({ method: "POST", url: "/orders", payload: order("p-3", 99) });
  assert.equal(res.statusCode, 409);
  assert.equal(events.published.length, 0);
});

test("RabbitMQ giù: l'ordine è confermato lo stesso (l'evento si perde)", async () => {
  const app = buildApp({ catalog: fakeCatalog(), events: createMemoryPublisher({ failing: true }) });
  const res = await app.inject({ method: "POST", url: "/orders", payload: order() });
  assert.equal(res.statusCode, 201);
  const ready = (await app.inject({ method: "GET", url: "/health/ready" })).json();
  assert.equal(ready.status, "ok");
  assert.equal(ready.dependencies.broker, "down");
});

test("la busta dell'evento: id unico, tipo, versione, data", () => {
  const o = { id: "o-1", customerEmail: "a@b.it", lines: [], totalCents: 0, status: "confirmed" as const, createdAt: "" };
  const a = orderCreatedEvent(o);
  const b = orderCreatedEvent(o);
  assert.notEqual(a.id, b.id);
  assert.equal(a.version, 1);
  assert.ok(!Number.isNaN(Date.parse(a.occurredAt)));
});

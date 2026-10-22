// Checkpoint delle lezioni 7 e 8, lato orders: un ordine confermato diventa un evento,
// salvato nell'OUTBOX insieme all'ordine e pubblicato dal relay.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { createMemoryPublisher, orderCreatedEvent } from "../src/events.js";
import { relayOnce } from "../src/outbox.js";
import { createOrderStore, type OrderStore } from "../src/store.js";
import { fakeCatalog } from "./fake-catalog.js";

const order = (productId = "p-1", quantity = 1) => ({ customerEmail: "anna@example.com", items: [{ productId, quantity }] });

function setup() {
  const store = createOrderStore();
  const app = buildApp({ catalog: fakeCatalog(), store });
  return { store, app };
}

// ---------------------------------------------------------------- l'ordine e il suo evento, insieme

test("un ordine confermato scrive UN evento OrderCreated nell'outbox", async () => {
  const { store, app } = setup();
  const res = await app.inject({ method: "POST", url: "/orders", payload: order() });
  assert.equal(res.statusCode, 201);
  assert.equal(store.outbox.length, 1);
  const { routingKey, event } = store.outbox[0];
  assert.equal(routingKey, "order.created");
  assert.equal(event.type, "OrderCreated");
  assert.equal((event.data as { orderId: string }).orderId, res.json().id);
});

test("l'evento porta il correlation ID della richiesta", async () => {
  const { store, app } = setup();
  await app.inject({ method: "POST", url: "/orders", payload: order(), headers: { "x-request-id": "abc123" } });
  assert.equal(store.outbox[0].event.correlationId, "abc123");
});

test("un ordine rifiutato non scrive niente nell'outbox", async () => {
  const { store, app } = setup();
  const res = await app.inject({ method: "POST", url: "/orders", payload: order("p-3", 99) });
  assert.equal(res.statusCode, 409);
  assert.equal(store.outbox.length, 0);
});

// ---------------------------------------------------------------- il relay

test("il relay pubblica gli eventi in attesa e li segna", async () => {
  const { store, app } = setup();
  await app.inject({ method: "POST", url: "/orders", payload: order() });
  await app.inject({ method: "POST", url: "/orders", payload: order() });
  const publisher = createMemoryPublisher();
  assert.equal(await relayOnce(store, publisher), 2);
  assert.deepEqual(publisher.published.map((p) => p.event.data.orderId), ["o-1", "o-2"]);
  assert.deepEqual(await store.outboxStats(), { pending: 0, published: 2 });
  assert.equal(await relayOnce(store, publisher), 0); // niente da rifare
});

test("RabbitMQ giù: l'ordine è confermato e l'evento ASPETTA nell'outbox", async () => {
  const { store, app } = setup();
  const res = await app.inject({ method: "POST", url: "/orders", payload: order() });
  assert.equal(res.statusCode, 201);
  const publisher = createMemoryPublisher({ failing: true });
  assert.equal(await relayOnce(store, publisher), 0);
  assert.deepEqual(await store.outboxStats(), { pending: 1, published: 0 });
  publisher.failing = false; // RabbitMQ torna
  assert.equal(await relayOnce(store, publisher), 1);
  assert.equal(publisher.published.length, 1);
});

test("GET /outbox/stats: in attesa e pubblicati", async () => {
  const { store, app } = setup();
  await app.inject({ method: "POST", url: "/orders", payload: order() });
  assert.deepEqual((await app.inject({ method: "GET", url: "/outbox/stats" })).json(), { pending: 1, published: 0 });
  await relayOnce(store, createMemoryPublisher());
  assert.deepEqual((await app.inject({ method: "GET", url: "/outbox/stats" })).json(), { pending: 0, published: 1 });
});

test("database giù: orders non è pronto (503)", async () => {
  const broken: OrderStore = {
    ...createOrderStore(),
    ping: async () => {
      throw new Error("database giù");
    },
  };
  const app = buildApp({ catalog: fakeCatalog(), store: broken });
  const res = await app.inject({ method: "GET", url: "/health/ready" });
  assert.equal(res.statusCode, 503);
  assert.equal(res.json().dependencies.database, "down");
});

test("la busta dell'evento: id unico, tipo, versione, data", () => {
  const o = { id: "o-1", customerEmail: "a@b.it", lines: [], totalCents: 0, status: "confirmed" as const, createdAt: "" };
  const a = orderCreatedEvent(o);
  const b = orderCreatedEvent(o);
  assert.notEqual(a.id, b.id);
  assert.equal(a.version, 1);
  assert.ok(!Number.isNaN(Date.parse(a.occurredAt)));
});

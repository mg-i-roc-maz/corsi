// Test degli esercizi extra della lezione 8, lato orders (4; il 3 è in extra-postgres.test.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { createOrderStore } from "../src/store.js";
import { fakeCatalog } from "./fake-catalog.js";

const payload = { customerEmail: "anna@example.com", items: [{ productId: "p-1", quantity: 1 }] };

test("Extra 4: annullare un ordine cambia lo stato e scrive OrderCancelled nell'outbox", async () => {
  const store = createOrderStore();
  const app = buildApp({ catalog: fakeCatalog(), store });
  const { id } = (await app.inject({ method: "POST", url: "/orders", payload })).json();
  const res = await app.inject({ method: "POST", url: `/orders/${id}/cancel` });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().status, "cancelled");
  assert.deepEqual(store.outbox.map((e) => e.routingKey), ["order.created", "order.cancelled"]);
});

test("Extra 4: annullare due volte non annulla due volte (409), e niente secondo evento", async () => {
  const store = createOrderStore();
  const app = buildApp({ catalog: fakeCatalog(), store });
  const { id } = (await app.inject({ method: "POST", url: "/orders", payload })).json();
  await app.inject({ method: "POST", url: `/orders/${id}/cancel` });
  const again = await app.inject({ method: "POST", url: `/orders/${id}/cancel` });
  assert.equal(again.statusCode, 409);
  assert.equal(store.outbox.length, 2);
});

test("Extra 4: annullare un ordine che non esiste: 404", async () => {
  const app = buildApp({ catalog: fakeCatalog(), store: createOrderStore() });
  assert.equal((await app.inject({ method: "POST", url: "/orders/o-999/cancel" })).statusCode, 404);
});

// Test degli esercizi extra della lezione 7, lato notifications (3).
import { test } from "node:test";
import assert from "node:assert/strict";
import { consumeMessage } from "../src/consume.js";
import { createHandler } from "../src/handlers.js";
import { createLogMailer } from "../src/mailer.js";

const lines = [{ productId: "p-1", productName: "Tastiera meccanica", quantity: 1, unitPriceCents: 8990 }];
const msg = (event: object) => ({ content: Buffer.from(JSON.stringify(event)), fields: { redelivered: false }, properties: {} });
const channel = () => ({ ack: () => {}, nack: () => {} });

test("Extra 3: OrderCreated v2 (cliente come oggetto) produce la stessa email", async () => {
  const mailer = createLogMailer();
  const event = {
    id: "ev-2",
    type: "OrderCreated",
    version: 2,
    occurredAt: "",
    data: { orderId: "o-9", customer: { email: "bruno@example.com", name: "Bruno" }, currency: "EUR", totalCents: 8990, lines },
  };
  await consumeMessage(msg(event), channel(), createHandler(mailer));
  const [email] = mailer.sent();
  assert.equal(email.to, "bruno@example.com");
  assert.match(email.body, /Ciao Bruno/);
});

test("Extra 3: la v1 funziona ancora", async () => {
  const mailer = createLogMailer();
  const event = { id: "ev-1", type: "OrderCreated", version: 1, occurredAt: "", data: { orderId: "o-1", customerEmail: "anna@example.com", totalCents: 8990, lines } };
  await consumeMessage(msg(event), channel(), createHandler(mailer));
  assert.equal(mailer.sent()[0].to, "anna@example.com");
});

test("Extra 3: una versione sconosciuta si ignora, senza errori", async () => {
  const mailer = createLogMailer();
  const handler = createHandler(mailer);
  await consumeMessage(msg({ id: "ev-3", type: "OrderCreated", version: 3, occurredAt: "", data: {} }), channel(), handler);
  assert.equal(mailer.sent().length, 0);
  assert.equal(handler.stats().ignored, 1);
});

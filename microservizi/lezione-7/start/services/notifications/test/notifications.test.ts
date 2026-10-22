// Checkpoint della lezione 7, lato notifications: dalla coda all'email.
// Niente RabbitMQ: il messaggio e il canale sono finti.
import { test } from "node:test";
import assert from "node:assert/strict";
import { consumeMessage, type IncomingMessage } from "../src/consume.js";
import { confirmationEmail, createHandler } from "../src/handlers.js";
import { createLogMailer } from "../src/mailer.js";
import { buildApp } from "../src/app.js";

const orderCreated = (overrides: object = {}) => ({
  id: "ev-1",
  type: "OrderCreated",
  version: 1,
  occurredAt: "2026-10-27T10:00:00.000Z",
  correlationId: "req-1",
  data: {
    orderId: "o-1",
    customerEmail: "anna@example.com",
    totalCents: 16970,
    lines: [
      { productId: "p-1", productName: "Tastiera meccanica", quantity: 1, unitPriceCents: 8990 },
      { productId: "p-2", productName: "Mouse wireless", quantity: 2, unitPriceCents: 3990 },
    ],
  },
  ...overrides,
});

const message = (body: unknown, redelivered = false): IncomingMessage => ({
  content: Buffer.from(typeof body === "string" ? body : JSON.stringify(body)),
  fields: { redelivered },
  properties: { messageId: "ev-1" },
});

// Un canale finto che ricorda le risposte
function fakeChannel() {
  const calls: string[] = [];
  return {
    calls,
    ack: () => calls.push("ack"),
    nack: (_msg: IncomingMessage, _all?: boolean, requeue?: boolean) => calls.push(requeue ? "nack-requeue" : "nack-discard"),
  };
}

test("OrderCreated: email al cliente, poi ack", async () => {
  const mailer = createLogMailer();
  const channel = fakeChannel();
  const outcome = await consumeMessage(message(orderCreated()), channel, createHandler(mailer));
  assert.equal(outcome, "acked");
  assert.deepEqual(channel.calls, ["ack"]);
  const [email] = mailer.sent();
  assert.equal(email.to, "anna@example.com");
  assert.equal(email.subject, "Conferma ordine o-1");
  assert.equal(email.eventId, "ev-1");
});

test("l'email elenca le righe e il totale in euro", () => {
  const email = confirmationEmail(orderCreated() as Parameters<typeof confirmationEmail>[0]);
  assert.match(email.body, /2 × Mouse wireless: 79,80 €/);
  assert.match(email.body, /Totale: 169,70 €/);
});

test("server di posta giù: nack con requeue, il messaggio torna in coda", async () => {
  const mailer = createLogMailer({ failPercent: 100 });
  const channel = fakeChannel();
  const handler = createHandler(mailer);
  assert.equal(await consumeMessage(message(orderCreated()), channel, handler), "requeued");
  assert.deepEqual(channel.calls, ["nack-requeue"]);
  assert.equal(handler.stats().failed, 1);
});

test("un messaggio illeggibile si scarta: rimetterlo in coda non servirebbe", async () => {
  const channel = fakeChannel();
  assert.equal(await consumeMessage(message("non è json"), channel, createHandler(createLogMailer())), "discarded");
  assert.deepEqual(channel.calls, ["nack-discard"]);
});

test("un tipo di evento sconosciuto si conferma e si ignora", async () => {
  const mailer = createLogMailer();
  const channel = fakeChannel();
  const handler = createHandler(mailer);
  await consumeMessage(message(orderCreated({ type: "OrderShipped" })), channel, handler);
  assert.deepEqual(channel.calls, ["ack"]);
  assert.equal(mailer.sent().length, 0);
  assert.equal(handler.stats().ignored, 1);
});

test("una riconsegna si conta: è il segno dell'at-least-once", async () => {
  const handler = createHandler(createLogMailer());
  await consumeMessage(message(orderCreated(), true), fakeChannel(), handler);
  assert.equal(handler.stats().redelivered, 1);
});

test("GET /notifications mostra le email inviate, dalla più recente", async () => {
  const mailer = createLogMailer();
  const handler = createHandler(mailer);
  await consumeMessage(message(orderCreated()), fakeChannel(), handler);
  await consumeMessage(message(orderCreated({ id: "ev-2", data: { ...orderCreated().data, orderId: "o-2" } })), fakeChannel(), handler);
  const app = buildApp({ mailer, stats: handler.stats });
  const list = (await app.inject({ method: "GET", url: "/notifications" })).json();
  assert.deepEqual(list.map((e: { subject: string }) => e.subject), ["Conferma ordine o-2", "Conferma ordine o-1"]);
  const stats = (await app.inject({ method: "GET", url: "/stats" })).json();
  assert.equal(stats.emailsSent, 2);
});

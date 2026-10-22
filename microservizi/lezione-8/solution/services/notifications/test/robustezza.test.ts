// Checkpoint della lezione 8, lato notifications: tentativi contati, DLQ, doppioni.
import { test } from "node:test";
import assert from "node:assert/strict";
import { ATTEMPT_HEADER, consumeMessage, type IncomingMessage } from "../src/consume.js";
import { createHandler } from "../src/handlers.js";
import { createLogMailer, type Mailer } from "../src/mailer.js";
import { createMemorySeenStore, type SeenStore } from "../src/seen.js";

const RETRY = { maxAttempts: 3, retryQueue: "attesa" };

const event = (id = "ev-1") => ({
  id,
  type: "OrderCreated",
  version: 1,
  occurredAt: "2026-11-03T10:00:00.000Z",
  data: { orderId: "o-1", customerEmail: "anna@example.com", totalCents: 8990, lines: [] },
});

const message = (body: object, failures = 0): IncomingMessage => ({
  content: Buffer.from(JSON.stringify(body)),
  fields: { redelivered: false },
  properties: { messageId: "ev-1", headers: failures ? { [ATTEMPT_HEADER]: failures } : {} },
});

function fakeChannel() {
  const calls: string[] = [];
  const sent: { queue: string; options: { headers?: Record<string, unknown> } }[] = [];
  return {
    calls,
    sent,
    ack: () => calls.push("ack"),
    nack: (_m: IncomingMessage, _a?: boolean, requeue?: boolean) => calls.push(requeue ? "nack-requeue" : "nack-discard"),
    sendToQueue: (queue: string, _c: Buffer, options: object = {}) => {
      calls.push(`send:${queue}`);
      sent.push({ queue, options: options as { headers?: Record<string, unknown> } });
      return true;
    },
  };
}

// ---------------------------------------------------------------- Parte 1: tentativi e DLQ

test("primo fallimento: in attesa con x-attempt 1", async () => {
  const channel = fakeChannel();
  const handler = createHandler(createLogMailer({ failPercent: 100 }));
  assert.equal(await consumeMessage(message(event()), channel, handler, RETRY), "retried");
  assert.equal(channel.sent[0].options.headers?.[ATTEMPT_HEADER], 1);
  assert.deepEqual(channel.calls, ["send:attesa", "ack"]);
});

test("secondo fallimento: in attesa con x-attempt 2", async () => {
  const channel = fakeChannel();
  const handler = createHandler(createLogMailer({ failPercent: 100 }));
  await consumeMessage(message(event(), 1), channel, handler, RETRY);
  assert.equal(channel.sent[0].options.headers?.[ATTEMPT_HEADER], 2);
});

test("terzo fallimento su 3: nella DLQ, senza altri tentativi", async () => {
  const channel = fakeChannel();
  const handler = createHandler(createLogMailer({ failPercent: 100 }));
  assert.equal(await consumeMessage(message(event(), 2), channel, handler, RETRY), "dead-lettered");
  assert.deepEqual(channel.calls, ["nack-discard"]);
});

test("un tentativo che riesce dopo due fallimenti: ack, e l'email parte", async () => {
  const mailer = createLogMailer();
  const channel = fakeChannel();
  assert.equal(await consumeMessage(message(event(), 2), channel, createHandler(mailer), RETRY), "acked");
  assert.equal(mailer.sent().length, 1);
});

// ---------------------------------------------------------------- Parte 2: consumer idempotente

test("lo stesso evento due volte: UNA email, il doppione si conferma e si salta", async () => {
  const mailer = createLogMailer();
  const handler = createHandler(mailer, { seen: createMemorySeenStore() });
  const first = fakeChannel();
  const second = fakeChannel();
  await consumeMessage(message(event()), first, handler, RETRY);
  await consumeMessage(message(event()), second, handler, RETRY);
  assert.equal(mailer.sent().length, 1);
  assert.deepEqual(second.calls, ["ack"]);
  assert.equal(handler.stats().duplicates, 1);
});

test("eventi diversi: due email", async () => {
  const mailer = createLogMailer();
  const handler = createHandler(mailer, { seen: createMemorySeenStore() });
  await consumeMessage(message(event("ev-1")), fakeChannel(), handler, RETRY);
  await consumeMessage(message(event("ev-2")), fakeChannel(), handler, RETRY);
  assert.equal(mailer.sent().length, 2);
});

test("email fallita: l'id si libera, il tentativo successivo la manda", async () => {
  let fail = true;
  const inner = createLogMailer();
  const mailer: Mailer = {
    sent: inner.sent,
    send: async (e) => {
      if (fail) throw new Error("posta giù");
      return inner.send(e);
    },
  };
  const handler = createHandler(mailer, { seen: createMemorySeenStore() });
  await consumeMessage(message(event()), fakeChannel(), handler, RETRY);
  fail = false;
  await consumeMessage(message(event(), 1), fakeChannel(), handler, RETRY);
  assert.equal(inner.sent().length, 1);
});

test("controllo dei doppioni giù: l'email parte lo stesso", async () => {
  const broken: SeenStore = {
    claim: async () => {
      throw new Error("Redis giù");
    },
    release: async () => {},
  };
  const mailer = createLogMailer();
  await consumeMessage(message(event()), fakeChannel(), createHandler(mailer, { seen: broken }), RETRY);
  assert.equal(mailer.sent().length, 1);
});

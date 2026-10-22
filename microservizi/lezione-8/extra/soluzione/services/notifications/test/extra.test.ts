// Test degli esercizi extra della lezione 8, lato notifications (2 e 4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { ATTEMPT_HEADER, consumeMessage } from "../src/consume.js";
import { replayDeadLetters } from "../src/replay-dlq.js";
import { createHandler } from "../src/handlers.js";
import { createLogMailer } from "../src/mailer.js";

type Msg = { content: Buffer; properties: { headers?: Record<string, unknown> } };
const ev = (id: string) => Buffer.from(JSON.stringify({ id, type: "OrderCreated", version: 1, occurredAt: "", data: { orderId: id } }));

// Una DLQ finta: get() restituisce i messaggi uno alla volta
function fakeDlq(messages: Msg[]) {
  const queue = [...messages];
  const sent: { queue: string; content: Buffer; options: { headers?: Record<string, unknown> } }[] = [];
  const back: Msg[] = [];
  return {
    sent,
    back,
    get: async () => queue.shift() ?? (false as const),
    sendToQueue: (q: string, content: Buffer, options: object = {}) => (sent.push({ queue: q, content, options }), true),
    ack: () => {},
    nack: (m: Msg) => back.push(m),
  };
}

test("Extra 2: i messaggi della DLQ tornano nella coda, con i tentativi azzerati", async () => {
  const dlq = fakeDlq([
    { content: ev("ev-1"), properties: { headers: { [ATTEMPT_HEADER]: 2, "x-death": [{}] } } },
    { content: ev("ev-2"), properties: { headers: { [ATTEMPT_HEADER]: 2 } } },
  ]);
  const result = await replayDeadLetters(dlq, { from: "dlq", to: "principale" });
  assert.deepEqual(result, { replayed: 2, skipped: 0 });
  assert.equal(dlq.sent[0].queue, "principale");
  assert.equal(dlq.sent[0].options.headers?.[ATTEMPT_HEADER], undefined);
  assert.equal(dlq.sent[0].options.headers?.["x-death"], undefined);
});

test("Extra 2: un messaggio illeggibile resta nella DLQ", async () => {
  const dlq = fakeDlq([{ content: Buffer.from("non è json"), properties: {} }]);
  const result = await replayDeadLetters(dlq, { from: "dlq", to: "principale" });
  assert.deepEqual(result, { replayed: 0, skipped: 1 });
  assert.equal(dlq.back.length, 1);
});

test("Extra 4: OrderCancelled produce l'email di annullamento", async () => {
  const mailer = createLogMailer();
  const content = Buffer.from(
    JSON.stringify({ id: "ev-9", type: "OrderCancelled", version: 1, occurredAt: "", data: { orderId: "o-3", customerEmail: "anna@example.com" } }),
  );
  const channel = { ack: () => {}, nack: () => {}, sendToQueue: () => true };
  await consumeMessage({ content, fields: { redelivered: false }, properties: {} }, channel, createHandler(mailer), { maxAttempts: 3, retryQueue: "attesa" });
  assert.equal(mailer.sent()[0].subject, "Ordine o-3 annullato");
});

// Test degli esercizi extra della lezione 7, lato orders (4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { createMemoryPublisher, type OrderEvents } from "../src/events.js";
import { withRetryBuffer } from "../src/retry-buffer.js";

const order = (id: string) => ({ id, customerEmail: "a@b.it", lines: [], totalCents: 0, status: "confirmed" as const, createdAt: "" });

// Un publisher che si può "spegnere" e "accendere"
function switchable() {
  const memory = createMemoryPublisher();
  let up = false;
  const events: OrderEvents = {
    async orderCreated(o, c) {
      if (!up) throw new Error("giù");
      return memory.orderCreated(o, c);
    },
    connected: () => up,
    close: async () => {},
  };
  return { events, memory, setUp: (value: boolean) => (up = value) };
}

test("Extra 4: con RabbitMQ giù l'evento resta da parte, poi parte", async () => {
  const s = switchable();
  const buffered = withRetryBuffer(s.events, { intervalMs: 60_000 });
  await buffered.orderCreated(order("o-1"));
  await buffered.orderCreated(order("o-2"));
  assert.equal(buffered.pending(), 2);
  s.setUp(true);
  await buffered.flush();
  assert.equal(buffered.pending(), 0);
  assert.deepEqual(s.memory.published.map((e) => e.data.orderId), ["o-1", "o-2"]);
  await buffered.close();
});

test("Extra 4: gli eventi in attesa partono prima di quello nuovo", async () => {
  const s = switchable();
  const buffered = withRetryBuffer(s.events, { intervalMs: 60_000 });
  await buffered.orderCreated(order("o-1"));
  s.setUp(true);
  await buffered.orderCreated(order("o-2"));
  assert.deepEqual(s.memory.published.map((e) => e.data.orderId), ["o-1", "o-2"]);
  await buffered.close();
});

test("Extra 4: oltre il massimo, il più vecchio si perde", async () => {
  const s = switchable();
  const buffered = withRetryBuffer(s.events, { intervalMs: 60_000, max: 2 });
  for (const id of ["o-1", "o-2", "o-3"]) await buffered.orderCreated(order(id));
  s.setUp(true);
  await buffered.flush();
  assert.deepEqual(s.memory.published.map((e) => e.data.orderId), ["o-2", "o-3"]);
  await buffered.close();
});

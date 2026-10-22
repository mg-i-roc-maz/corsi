// Con un PostgreSQL vero (ORDERS_DATABASE_URL): la transazione dell'outbox.
// Senza ORDERS_DATABASE_URL i test vengono saltati.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createPostgresOrderStore } from "../src/store-postgres.js";
import { orderCreatedEvent, ORDER_CREATED } from "../src/events.js";

const url = process.env.ORDERS_DATABASE_URL;
const skip = !url && "serve ORDERS_DATABASE_URL";
const lines = [{ productId: "p-1", productName: "Tastiera meccanica", quantity: 2, unitPriceCents: 8990 }];

test("ordine ed evento si salvano insieme", { skip }, async () => {
  const store = createPostgresOrderStore(url!);
  try {
    const order = await store.create("anna@example.com", lines, (o) => [{ routingKey: ORDER_CREATED, event: orderCreatedEvent(o) }]);
    assert.equal(order.totalCents, 17980);
    assert.deepEqual((await store.get(order.id))?.lines, lines);
    const isMine = (e: { event: { data: unknown } }) => (e.event.data as { orderId: string }).orderId === order.id;
    const mine = (await store.pendingEvents(10_000)).find(isMine);
    assert.ok(mine, "l'evento dell'ordine è nell'outbox");
    await store.markPublished([mine.id]);
    assert.equal((await store.pendingEvents(10_000)).some(isMine), false);
  } finally {
    await store.close();
  }
});

test("se l'evento non si può salvare, non si salva neanche l'ordine (ROLLBACK)", { skip }, async () => {
  const store = createPostgresOrderStore(url!);
  try {
    const before = (await store.list()).length;
    const event = orderCreatedEvent({ id: "x", customerEmail: "", lines: [], totalCents: 0, status: "confirmed", createdAt: "" });
    // Lo stesso evento due volte: event_id è UNIQUE, la seconda INSERT fallisce.
    await assert.rejects(
      store.create("bruno@example.com", lines, () => [
        { routingKey: ORDER_CREATED, event },
        { routingKey: ORDER_CREATED, event },
      ]),
    );
    assert.equal((await store.list()).length, before);
  } finally {
    await store.close();
  }
});

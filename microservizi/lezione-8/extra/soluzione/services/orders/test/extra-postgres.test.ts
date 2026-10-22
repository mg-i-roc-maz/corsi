// Extra 3 con un PostgreSQL vero (ORDERS_DATABASE_URL): due relay, nessun doppione.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createPostgresOrderStore } from "../src/store-postgres.js";
import { ORDER_CREATED, orderCreatedEvent } from "../src/events.js";
import { relayOnce } from "../src/outbox.js";
import { createMemoryPublisher } from "../src/events.js";

const url = process.env.ORDERS_DATABASE_URL;

test("Extra 3: due relay in parallelo pubblicano ogni evento UNA volta", { skip: !url && "serve ORDERS_DATABASE_URL" }, async () => {
  const a = createPostgresOrderStore(url!);
  const b = createPostgresOrderStore(url!);
  try {
    // Svuota l'arretrato, poi 20 ordini nuovi
    await relayOnce(a, createMemoryPublisher(), { batch: 10_000 });
    const mine = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const o = await a.create("anna@example.com", [], (o) => [{ routingKey: ORDER_CREATED, event: orderCreatedEvent(o) }]);
      mine.add(o.id);
    }
    // Un publisher lento, così i due relay lavorano davvero insieme
    const slow = () => {
      const p = createMemoryPublisher();
      const publish = p.publish.bind(p);
      p.publish = async (k, e) => {
        await new Promise((r) => setTimeout(r, 5));
        return publish(k, e);
      };
      return p;
    };
    const pa = slow();
    const pb = slow();
    await Promise.all([relayOnce(a, pa, { batch: 100 }), relayOnce(b, pb, { batch: 100 })]);
    // Contiamo solo i nostri: altri test possono creare ordini nello stesso momento.
    const ids = [...pa.published, ...pb.published].filter((x) => mine.has(x.event.data.orderId)).map((x) => x.event.id);
    assert.equal(ids.length, 20);
    assert.equal(new Set(ids).size, 20);
  } finally {
    await a.close();
    await b.close();
  }
});

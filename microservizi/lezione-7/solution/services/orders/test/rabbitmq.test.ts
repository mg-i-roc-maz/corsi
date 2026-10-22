// Con un RabbitMQ vero (RABBITMQ_URL): l'evento pubblicato arriva in una coda collegata.
// Senza RABBITMQ_URL il test viene saltato.
import { test } from "node:test";
import assert from "node:assert/strict";
import amqp from "amqplib";
import { createRabbitPublisher, EXCHANGE, ORDER_CREATED } from "../src/events.js";

const url = process.env.RABBITMQ_URL;

test("OrderCreated pubblicato su shop.events arriva in una coda collegata", { skip: !url && "serve RABBITMQ_URL" }, async () => {
  // Una coda temporanea, tutta nostra, collegata a order.created
  const conn = await amqp.connect(url!);
  const ch = await conn.createChannel();
  await ch.assertExchange(EXCHANGE, "topic", { durable: true });
  const { queue } = await ch.assertQueue("", { exclusive: true });
  await ch.bindQueue(queue, EXCHANGE, ORDER_CREATED);

  const publisher = await createRabbitPublisher({ url: url! });
  try {
    for (let i = 0; i < 50 && !publisher.connected(); i++) await new Promise((r) => setTimeout(r, 50));
    const order = { id: "o-test", customerEmail: "a@b.it", lines: [], totalCents: 100, status: "confirmed" as const, createdAt: "" };
    await publisher.orderCreated(order, "req-1");
    let msg: amqp.GetMessage | false = false;
    for (let i = 0; i < 20 && !msg; i++) {
      msg = await ch.get(queue, { noAck: true });
      if (!msg) await new Promise((r) => setTimeout(r, 50));
    }
    assert.ok(msg, "il messaggio deve arrivare");
    const event = JSON.parse(msg.content.toString());
    assert.equal(event.data.orderId, "o-test");
    assert.equal(msg.properties.messageId, event.id);
    assert.equal(msg.properties.correlationId, "req-1");
  } finally {
    await publisher.close();
    await conn.close();
  }
});

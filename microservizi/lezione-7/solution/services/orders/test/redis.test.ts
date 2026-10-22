// Con un Redis vero (REDIS_URL): l'avviso pubblicato arriva all'iscritto.
// Senza REDIS_URL il test viene saltato.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "redis";
import { PRODUCT_CHANNEL, subscribeToProductChanges } from "../src/invalidation.js";

const url = process.env.REDIS_URL;

test("un ProductChanged pubblicato su Redis arriva a orders", { skip: !url && "serve REDIS_URL" }, async () => {
  const received: string[] = [];
  const subscription = subscribeToProductChanges({ url: url!, onProductChanged: (event) => received.push(event.productId) });
  const publisher = createClient({ url });
  await publisher.connect();
  try {
    // Aspettiamo che l'iscrizione sia attiva: PUBLISH dice quanti l'hanno ricevuto.
    for (let i = 0; i < 50; i++) {
      const delivered = await publisher.publish(PRODUCT_CHANNEL, JSON.stringify({ type: "ProductChanged", productId: "p-1" }));
      if (delivered > 0) break;
      await new Promise((r) => setTimeout(r, 50));
    }
    await new Promise((r) => setTimeout(r, 100));
    assert.ok(received.includes("p-1"));
  } finally {
    await publisher.close();
    await subscription.close();
  }
});

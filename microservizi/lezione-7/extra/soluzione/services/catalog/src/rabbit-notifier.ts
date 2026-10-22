// Extra 2: ProductChanged su RabbitMQ invece che su Redis Pub/Sub.
//
// Stesso evento, stesso exchange degli ordini (shop.events), routing key "product.changed".
// La differenza: chi ascolta ha una CODA sua. Se orders è spento, gli avvisi lo aspettano.
import amqp, { type ChannelModel, type ConfirmChannel } from "amqplib";
import type { ProductChange, ProductEvents } from "./notifier.js";

export const EXCHANGE = "shop.events";
export const PRODUCT_CHANGED = "product.changed";

export async function createRabbitNotifier({
  url,
  log,
}: {
  url: string;
  log?: { warn: (obj: object, msg: string) => void };
}): Promise<ProductEvents> {
  let channel: ConfirmChannel | undefined;
  const connection = await amqp.connect(url, {
    recovery: {
      initialDelay: 200,
      maxDelay: 5000,
      waitForConnect: false,
      async setup(model: ChannelModel) {
        const ch = await model.createConfirmChannel();
        ch.on("error", (err: Error) => log?.warn({ err: err.message }, "errore sul canale RabbitMQ"));
        await ch.assertExchange(EXCHANGE, "topic", { durable: true });
        channel = ch;
      },
    },
  });
  connection.on("disconnect", (err: Error) => {
    channel = undefined;
    log?.warn({ err: err.message }, "RabbitMQ non raggiungibile: gli avvisi ProductChanged non partono");
  });
  connection.on("error", () => {});

  return {
    async productChanged(productId: string, change: ProductChange) {
      const ch = channel;
      if (!ch) throw new Error("RabbitMQ non collegato");
      const event = { type: "ProductChanged", productId, change, at: new Date().toISOString() };
      await new Promise<void>((resolve, reject) =>
        ch.publish(EXCHANGE, PRODUCT_CHANGED, Buffer.from(JSON.stringify(event)), { persistent: true, contentType: "application/json" }, (err) =>
          err ? reject(err) : resolve(),
        ),
      );
    },
    async close() {
      await connection.close().catch(() => {});
    },
  };
}

// Extra 2: gli avvisi ProductChanged da una CODA RabbitMQ invece che da Redis Pub/Sub.
//
// La coda "orders.product-changed" è di orders: durable, collegata a "product.changed".
// Se orders è spento, gli avvisi lo aspettano lì. Alla ripartenza li legge tutti
// e butta le copie giuste: niente più "avvisi persi".
import amqp, { type ChannelModel, type ConsumeMessage } from "amqplib";
import { parseProductChanged, type ProductChanged } from "./invalidation.js";
import { EXCHANGE } from "./events.js";

export const PRODUCT_QUEUE = "orders.product-changed";
export const PRODUCT_CHANGED = "product.changed";

export async function consumeProductChanges({
  url,
  onProductChanged,
  log,
}: {
  url: string;
  onProductChanged: (event: ProductChanged) => void;
  log?: { warn: (obj: object, msg: string) => void };
}) {
  const connection = await amqp.connect(url, {
    recovery: {
      initialDelay: 200,
      maxDelay: 5000,
      waitForConnect: false,
      async setup(model: ChannelModel) {
        const ch = await model.createChannel();
        ch.on("error", (err: Error) => log?.warn({ err: err.message }, "errore sul canale RabbitMQ"));
        await ch.assertExchange(EXCHANGE, "topic", { durable: true });
        await ch.assertQueue(PRODUCT_QUEUE, { durable: true });
        await ch.bindQueue(PRODUCT_QUEUE, EXCHANGE, PRODUCT_CHANGED);
        await ch.consume(PRODUCT_QUEUE, (msg: ConsumeMessage | null) => {
          if (!msg) return;
          const event = parseProductChanged(msg.content.toString("utf8"));
          if (event) onProductChanged(event);
          else log?.warn({}, "avviso di catalog non valido, scartato");
          // Buttare una copia non può fallire: si conferma sempre.
          ch.ack(msg);
        });
      },
    },
  });
  connection.on("error", () => {});
  return {
    async close() {
      await connection.close().catch(() => {});
    },
  };
}

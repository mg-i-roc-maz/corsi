// Il collegamento di notifications con RabbitMQ.
//
//   exchange  shop.events (topic)        dove orders pubblica
//   coda      notifications.order-created  la NOSTRA coda: ci aspettano i messaggi
//   binding   order.created              quali messaggi dell'exchange finiscono nella coda
//
// La coda la dichiara chi consuma: è sua. È durable: sopravvive a un riavvio di RabbitMQ,
// e i messaggi persistenti dentro di lei pure.
import amqp, { type ChannelModel, type ConsumeMessage } from "amqplib";
import { consumeMessage, type Handler } from "./consume.js";

export const EXCHANGE = "shop.events";
export const QUEUE = "notifications.order-created";
export const BINDING = "order.created";

type Log = {
  info: (obj: object, msg: string) => void;
  warn: (obj: object, msg: string) => void;
  error: (obj: object, msg: string) => void;
};

export interface ConsumerOptions {
  url: string;
  handler: Handler;
  // Quanti messaggi può avere "in mano" (non ancora confermati) questo consumer.
  prefetch?: number;
  log?: Log;
}

export async function startConsumer({ url, handler, prefetch = 10, log }: ConsumerOptions) {
  let connected = false;

  const connection = await amqp.connect(url, {
    recovery: {
      initialDelay: 200,
      maxDelay: 5000,
      waitForConnect: false, // notifications parte anche se RabbitMQ non c'è ancora
      // Chiamata a ogni (ri)connessione: la topologia si dichiara ogni volta.
      async setup(model: ChannelModel) {
        const channel = await model.createChannel();
        // Un errore del canale (per esempio una coda dichiarata con argomenti diversi)
        // senza questo ascoltatore farebbe terminare il processo.
        channel.on("error", (err: Error) => log?.error({ err: err.message }, "errore sul canale RabbitMQ"));
        await channel.assertExchange(EXCHANGE, "topic", { durable: true });
        await channel.assertQueue(QUEUE, { durable: true });
        await channel.bindQueue(QUEUE, EXCHANGE, BINDING);
        // Non più di "prefetch" messaggi alla volta senza conferma:
        // con due copie di notifications, il lavoro si divide.
        await channel.prefetch(prefetch);
        await channel.consume(
          QUEUE,
          (msg: ConsumeMessage | null) => {
            if (msg) void consumeMessage(msg, channel, handler, log);
          },
          { noAck: false }, // le conferme le diamo noi, a lavoro finito
        );
        connected = true;
        log?.info({ queue: QUEUE, binding: BINDING, prefetch }, "in ascolto sulla coda");
      },
    },
  });
  connection.on("disconnect", (err: Error) => {
    connected = false;
    log?.warn({ err: err.message }, "RabbitMQ non raggiungibile: riprovo");
  });
  connection.on("error", () => {});

  return {
    connected: () => connected,
    async close() {
      await connection.close().catch(() => {});
    },
  };
}

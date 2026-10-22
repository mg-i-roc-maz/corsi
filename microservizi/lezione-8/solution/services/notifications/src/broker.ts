// Il collegamento di notifications con RabbitMQ, ora con tre code:
//
//   notifications.order-created        la coda principale (lezione 7)
//   notifications.order-created.retry  la coda di ATTESA: nessuno la legge. Dopo RETRY_DELAY_MS
//                                      ogni messaggio "scade" e torna nella coda principale
//   notifications.order-created.dlq    la DEAD LETTER QUEUE: i messaggi che non ce l'hanno fatta.
//                                      Nessuno la legge in automatico: la guarda una persona
//
// Come ci arrivano? Con gli argomenti delle code (x-...), che RabbitMQ applica da solo:
//   principale: x-dead-letter-exchange  i messaggi rifiutati (nack senza requeue) vanno a shop.dlx
//   attesa:     x-message-ttl           dopo N ms il messaggio scade...
//               x-dead-letter-exchange  ...e va all'exchange "" (quello predefinito)
//               x-dead-letter-routing-key  con la chiave = nome della coda principale
//
// ATTENZIONE: gli argomenti di una coda non si cambiano. Se la coda esiste già con
// argomenti diversi, RabbitMQ risponde PRECONDITION_FAILED: va cancellata e ricreata.
import amqp, { type ChannelModel, type ConsumeMessage } from "amqplib";
import { consumeMessage, type Handler, type Outcome } from "./consume.js";

export const EXCHANGE = "shop.events";
export const QUEUE = "notifications.order-created";
export const BINDING = "order.created";
export const RETRY_QUEUE = `${QUEUE}.retry`;
export const DLX = "shop.dlx";
export const DLQ = `${QUEUE}.dlq`;

type Log = {
  info: (obj: object, msg: string) => void;
  warn: (obj: object, msg: string) => void;
  error: (obj: object, msg: string) => void;
};

export interface ConsumerOptions {
  url: string;
  handler: Handler;
  prefetch?: number;
  maxAttempts?: number;
  retryDelayMs?: number;
  onOutcome?: (outcome: Outcome) => void;
  log?: Log;
}

export async function startConsumer({
  url,
  handler,
  prefetch = 10,
  maxAttempts = 3,
  retryDelayMs = 5000,
  onOutcome,
  log,
}: ConsumerOptions) {
  let connected = false;

  const connection = await amqp.connect(url, {
    recovery: {
      initialDelay: 200,
      maxDelay: 5000,
      waitForConnect: false,
      async setup(model: ChannelModel) {
        const channel = await model.createChannel();
        // Un errore del canale (per esempio una coda dichiarata con argomenti diversi)
        // senza questo ascoltatore farebbe terminare il processo.
        channel.on("error", (err: Error) => log?.error({ err: err.message }, "errore sul canale RabbitMQ"));
        await channel.assertExchange(EXCHANGE, "topic", { durable: true });

        // Il dead letter exchange e la DLQ.
        await channel.assertExchange(DLX, "direct", { durable: true });
        await channel.assertQueue(DLQ, { durable: true });
        await channel.bindQueue(DLQ, DLX, QUEUE);

        // La coda principale: i rifiutati vanno a shop.dlx, con chiave = nome della coda.
        await channel.assertQueue(QUEUE, {
          durable: true,
          deadLetterExchange: DLX,
          deadLetterRoutingKey: QUEUE,
        });
        await channel.bindQueue(QUEUE, EXCHANGE, BINDING);

        // La coda di attesa: dopo retryDelayMs i messaggi tornano nella principale.
        await channel.assertQueue(RETRY_QUEUE, {
          durable: true,
          messageTtl: retryDelayMs,
          deadLetterExchange: "",
          deadLetterRoutingKey: QUEUE,
        });

        await channel.prefetch(prefetch);
        await channel.consume(
          QUEUE,
          (msg: ConsumeMessage | null) => {
            if (!msg) return;
            void consumeMessage(msg, channel, handler, { maxAttempts, retryQueue: RETRY_QUEUE }, log).then((outcome) =>
              onOutcome?.(outcome),
            );
          },
          { noAck: false },
        );
        connected = true;
        log?.info({ queue: QUEUE, retryQueue: RETRY_QUEUE, dlq: DLQ, maxAttempts, retryDelayMs }, "in ascolto sulla coda");
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

// EVENTI: orders racconta cosa è successo, senza sapere chi ascolta.
//
// Quando un ordine è confermato, orders pubblica un evento OrderCreated sull'exchange
// "shop.events" di RabbitMQ, con routing key "order.created". RabbitMQ lo copia in
// ogni coda collegata a quella chiave (oggi: la coda di notifications).
//
// Prima (lezione 3) era una chiamata diretta: "manda l'email". Ora è un fatto:
// "è stato creato l'ordine o-1". Chi lo vuole sapere si iscrive.
import { randomUUID } from "node:crypto";
import amqp, { type ChannelModel, type ConfirmChannel, type Message } from "amqplib";
import type { Order } from "./store.js";

export const EXCHANGE = "shop.events";
export const ORDER_CREATED = "order.created";

// La busta di ogni evento: uguale per tutti i tipi, cambia solo "data".
export interface EventEnvelope<T> {
  id: string; // unico: serve a chi riceve per riconoscere un doppione (lezione 8)
  type: string; // "OrderCreated"
  version: number; // la versione del contratto: se cambia "data", cambia la versione
  occurredAt: string; // quando è successo, ISO 8601
  correlationId?: string; // lo stesso x-request-id della richiesta (lezione 4)
  data: T;
}

export interface OrderCreatedData {
  orderId: string;
  customerEmail: string;
  totalCents: number;
  lines: { productId: string; productName: string; quantity: number; unitPriceCents: number }[];
}

export function orderCreatedEvent(order: Order, correlationId?: string): EventEnvelope<OrderCreatedData> {
  return {
    id: randomUUID(),
    type: "OrderCreated",
    version: 1,
    occurredAt: new Date().toISOString(),
    correlationId,
    data: {
      orderId: order.id,
      customerEmail: order.customerEmail,
      totalCents: order.totalCents,
      lines: order.lines,
    },
  };
}

export interface OrderEvents {
  orderCreated(order: Order, correlationId?: string): Promise<void>;
  connected(): boolean;
  close(): Promise<void>;
}

type Log = {
  info: (obj: object, msg: string) => void;
  warn: (obj: object, msg: string) => void;
};

export async function createRabbitPublisher({ url, log }: { url: string; log?: Log }): Promise<OrderEvents> {
  let channel: ConfirmChannel | undefined;

  // Connessione con RIPRISTINO automatico: se RabbitMQ cade, amqplib riprova
  // con backoff e jitter (lezione 4) e, a ogni nuova connessione, richiama setup().
  const connection = await amqp.connect(url, {
    recovery: {
      initialDelay: 200,
      maxDelay: 5000,
      waitForConnect: false, // orders parte anche se RabbitMQ non c'è ancora
      async setup(model: ChannelModel) {
        // Canale con CONFERME: RabbitMQ ci dice quando ha davvero preso in carico un messaggio.
        const ch = await model.createConfirmChannel();
        ch.on("error", (err: Error) => log?.warn({ err: err.message }, "errore sul canale RabbitMQ"));
        // L'exchange si dichiara: se c'è già non succede niente, se manca viene creato.
        // durable: sopravvive a un riavvio di RabbitMQ.
        await ch.assertExchange(EXCHANGE, "topic", { durable: true });
        // Un messaggio "mandatory" che nessuna coda può ricevere torna indietro.
        ch.on("return", (msg: Message) =>
          log?.warn(
            { routingKey: msg.fields.routingKey, eventId: msg.properties.messageId },
            "nessuna coda per questo evento: è andato perso",
          ),
        );
        channel = ch;
      },
    },
  });
  connection.on("connect", () => log?.info({ exchange: EXCHANGE }, "collegato a RabbitMQ"));
  connection.on("disconnect", (err: Error) => {
    channel = undefined;
    log?.warn({ err: err.message }, "RabbitMQ non raggiungibile: riprovo");
  });
  connection.on("error", () => {});

  return {
    async orderCreated(order, correlationId) {
      const ch = channel;
      if (!ch) throw new Error("RabbitMQ non collegato");
      const event = orderCreatedEvent(order, correlationId);
      // Pubblica e aspetta la conferma del broker.
      await new Promise<void>((resolve, reject) => {
        ch.publish(EXCHANGE, ORDER_CREATED, Buffer.from(JSON.stringify(event)), {
          persistent: true, // scritto su disco: sopravvive a un riavvio di RabbitMQ
          mandatory: true, // se nessuna coda lo riceve, torna indietro (evento "return")
          contentType: "application/json",
          messageId: event.id,
          type: event.type,
          correlationId,
          timestamp: Math.floor(Date.now() / 1000),
        }, (err) => (err ? reject(err) : resolve()));
      });
    },
    connected: () => channel !== undefined,
    async close() {
      await connection.close().catch(() => {});
    },
  };
}

// Per i test: ricorda gli eventi invece di mandarli.
export function createMemoryPublisher(options: { failing?: boolean } = {}): OrderEvents & {
  published: EventEnvelope<OrderCreatedData>[];
} {
  const published: EventEnvelope<OrderCreatedData>[] = [];
  return {
    published,
    async orderCreated(order, correlationId) {
      if (options.failing) throw new Error("RabbitMQ non collegato (finto)");
      published.push(orderCreatedEvent(order, correlationId));
    },
    connected: () => !options.failing,
    async close() {},
  };
}

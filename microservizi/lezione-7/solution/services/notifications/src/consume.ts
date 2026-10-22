// CONSUMARE un messaggio, e dire a RabbitMQ com'è andata.
//
// RabbitMQ consegna un messaggio e aspetta una risposta:
//   ack            "fatto": il messaggio viene tolto dalla coda
//   nack, requeue  "non ce l'ho fatta, riprova": torna in coda e viene riconsegnato
//   nack, scarta   "questo messaggio non lo capirò mai": viene tolto (lezione 8: DLQ)
//
// Finché non arriva una risposta il messaggio resta "unacked": se notifications
// cade a metà lavoro, RabbitMQ lo riconsegna a qualcun altro. È la consegna
// AT-LEAST-ONCE: almeno una volta, a volte due.

// Quello che ci serve di un messaggio di amqplib (così i test non hanno bisogno di RabbitMQ).
export interface IncomingMessage {
  content: Buffer;
  fields: { redelivered: boolean; routingKey?: string };
  properties: { messageId?: string };
}

export interface Acknowledger {
  ack(msg: IncomingMessage): void;
  nack(msg: IncomingMessage, allUpTo?: boolean, requeue?: boolean): void;
}

export interface EventEnvelope {
  id: string;
  type: string;
  version: number;
  occurredAt: string;
  correlationId?: string;
  data: unknown;
}

export type Outcome = "acked" | "requeued" | "discarded";

export type Handler = (event: EventEnvelope, info: { redelivered: boolean }) => Promise<void>;

type Log = {
  info: (obj: object, msg: string) => void;
  warn: (obj: object, msg: string) => void;
  error: (obj: object, msg: string) => void;
};

// Legge la busta. Un messaggio che non si capisce non si capirà mai: va scartato.
export function parseEnvelope(content: Buffer): EventEnvelope | undefined {
  try {
    const event = JSON.parse(content.toString("utf8")) as Partial<EventEnvelope>;
    if (typeof event.id === "string" && typeof event.type === "string" && event.data !== undefined) {
      return event as EventEnvelope;
    }
  } catch {
    // non è JSON
  }
  return undefined;
}

export async function consumeMessage(
  msg: IncomingMessage,
  channel: Acknowledger,
  handler: Handler,
  log?: Log,
): Promise<Outcome> {
  const event = parseEnvelope(msg.content);
  if (!event) {
    log?.error({ messageId: msg.properties.messageId }, "messaggio non valido: scartato");
    // requeue false: rimetterlo in coda vorrebbe dire riceverlo di nuovo, per sempre.
    channel.nack(msg, false, false);
    return "discarded";
  }

  try {
    await handler(event, { redelivered: msg.fields.redelivered });
    // ack SOLO dopo aver finito il lavoro: se cadiamo prima, il messaggio non è perso.
    channel.ack(msg);
    return "acked";
  } catch (err) {
    log?.warn(
      { eventId: event.id, type: event.type, err: (err as Error).message, redelivered: msg.fields.redelivered },
      "elaborazione fallita: il messaggio torna in coda",
    );
    // ATTENZIONE: un messaggio che fallisce SEMPRE torna in coda per sempre.
    // Nella lezione 8: tentativi contati e Dead Letter Queue.
    channel.nack(msg, false, true);
    return "requeued";
  }
}

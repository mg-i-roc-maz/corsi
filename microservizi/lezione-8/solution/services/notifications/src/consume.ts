// CONSUMARE un messaggio, e dire a RabbitMQ com'è andata (lezione 7),
// ora con NUOVI TENTATIVI CONTATI e DEAD LETTER QUEUE (lezione 8).
//
//   riuscito                      ack: il messaggio viene tolto dalla coda
//   fallito, tentativi rimasti    una copia va nella coda di ATTESA (retry), poi ack:
//                                 dopo RETRY_DELAY_MS RabbitMQ la rimette nella coda principale
//   fallito, tentativi finiti     nack senza requeue: RabbitMQ lo sposta nella DLQ
//   illeggibile                   nack senza requeue: subito nella DLQ, riprovarlo non serve
//
// Nella lezione 7 un messaggio che falliva SEMPRE tornava in coda per sempre.
// Ora dopo MAX_ATTEMPTS tentativi finisce nella DLQ, dove una persona può guardarlo.

export interface IncomingMessage {
  content: Buffer;
  fields: { redelivered: boolean; routingKey?: string };
  properties: { messageId?: string; headers?: Record<string, unknown> };
}

export interface Acknowledger {
  ack(msg: IncomingMessage): void;
  nack(msg: IncomingMessage, allUpTo?: boolean, requeue?: boolean): void;
  sendToQueue(queue: string, content: Buffer, options?: object): boolean;
}

export interface EventEnvelope {
  id: string;
  type: string;
  version: number;
  occurredAt: string;
  correlationId?: string;
  data: unknown;
}

export type Outcome = "acked" | "retried" | "dead-lettered";

export type Handler = (event: EventEnvelope, info: { redelivered: boolean; attempt: number }) => Promise<void>;

export interface RetryOptions {
  maxAttempts: number; // tentativi in tutto, il primo compreso
  retryQueue: string; // la coda di attesa
}

type Log = {
  info: (obj: object, msg: string) => void;
  warn: (obj: object, msg: string) => void;
  error: (obj: object, msg: string) => void;
};

// L'header dove contiamo i tentativi già falliti. Viaggia con il messaggio.
export const ATTEMPT_HEADER = "x-attempt";

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

// Quanti tentativi sono GIÀ falliti, secondo il messaggio.
export function previousFailures(msg: IncomingMessage): number {
  const value = Number(msg.properties.headers?.[ATTEMPT_HEADER] ?? 0);
  return Number.isInteger(value) && value > 0 ? value : 0;
}

export async function consumeMessage(
  msg: IncomingMessage,
  channel: Acknowledger,
  handler: Handler,
  retry: RetryOptions,
  log?: Log,
): Promise<Outcome> {
  const event = parseEnvelope(msg.content);
  if (!event) {
    log?.error({ messageId: msg.properties.messageId }, "messaggio non valido: nella DLQ");
    channel.nack(msg, false, false);
    return "dead-lettered";
  }

  const failures = previousFailures(msg);
  const attempt = failures + 1;
  try {
    await handler(event, { redelivered: msg.fields.redelivered, attempt });
    channel.ack(msg);
    return "acked";
  } catch (err) {
    const reason = (err as Error).message;
    if (attempt < retry.maxAttempts) {
      // Una copia nella coda di attesa, con il contatore aggiornato. Poi l'originale si conferma.
      channel.sendToQueue(retry.retryQueue, msg.content, {
        ...msg.properties,
        persistent: true,
        headers: { ...msg.properties.headers, [ATTEMPT_HEADER]: attempt },
      });
      channel.ack(msg);
      log?.warn({ eventId: event.id, attempt, maxAttempts: retry.maxAttempts, err: reason }, "tentativo fallito: riprovo più tardi");
      return "retried";
    }
    // Tentativi finiti: senza requeue RabbitMQ lo manda al dead letter exchange, e da lì nella DLQ.
    log?.error({ eventId: event.id, attempt, err: reason }, "tentativi finiti: messaggio nella DLQ");
    channel.nack(msg, false, false);
    return "dead-lettered";
  }
}

// Extra 2: rimettere in coda i messaggi della DLQ.
//
// La DLQ non è un cestino: è una sala d'attesa. Quando la causa è sistemata
// (il server di posta è tornato, il bug è corretto), i messaggi si rimettono
// nella coda principale, con il contatore dei tentativi azzerato.
// I messaggi ILLEGGIBILI no: tornerebbero nella DLQ subito. Quelli si guardano a mano.
import { ATTEMPT_HEADER, parseEnvelope } from "./consume.js";

interface DeadMessage {
  content: Buffer;
  properties: { headers?: Record<string, unknown> };
}

export interface ReplayChannel {
  get(queue: string, options: { noAck: boolean }): Promise<DeadMessage | false>;
  sendToQueue(queue: string, content: Buffer, options?: object): boolean;
  ack(msg: DeadMessage): void;
  nack(msg: DeadMessage, allUpTo?: boolean, requeue?: boolean): void;
}

export async function replayDeadLetters(channel: ReplayChannel, { from, to, max = 1000 }: { from: string; to: string; max?: number }) {
  const result = { replayed: 0, skipped: 0 };
  const skippedMessages: DeadMessage[] = [];
  for (let i = 0; i < max; i++) {
    const msg = await channel.get(from, { noAck: false });
    if (!msg) break;
    if (!parseEnvelope(msg.content)) {
      // Illeggibile: resta nella DLQ (lo rimettiamo dopo, per non rileggerlo in questo giro).
      skippedMessages.push(msg);
      result.skipped++;
      continue;
    }
    const { [ATTEMPT_HEADER]: _attempts, "x-death": _death, ...headers } = msg.properties.headers ?? {};
    channel.sendToQueue(to, msg.content, { ...msg.properties, persistent: true, headers });
    channel.ack(msg);
    result.replayed++;
  }
  // I messaggi saltati tornano nella DLQ.
  for (const msg of skippedMessages) channel.nack(msg, false, true);
  return result;
}

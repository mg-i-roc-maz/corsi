// Cosa fa notifications con ogni tipo di evento.
// Oggi uno solo: OrderCreated -> email di conferma al cliente.
import type { EventEnvelope, Handler } from "./consume.js";
import type { Mailer } from "./mailer.js";
import type { SeenStore } from "./seen.js";

// Il contratto di OrderCreated, versione 1, visto da chi lo riceve.
// È una COPIA di quello di orders: i servizi non condividono codice, condividono il contratto.
export interface OrderCreatedV1 {
  orderId: string;
  customerEmail: string;
  totalCents: number;
  lines: { productId: string; productName: string; quantity: number; unitPriceCents: number }[];
}

const euro = (cents: number) => `${(cents / 100).toFixed(2).replace(".", ",")} €`;

export function confirmationEmail(event: EventEnvelope & { data: OrderCreatedV1 }) {
  const { orderId, customerEmail, totalCents, lines } = event.data;
  const rows = lines.map((l) => `- ${l.quantity} × ${l.productName}: ${euro(l.quantity * l.unitPriceCents)}`);
  return {
    to: customerEmail,
    subject: `Conferma ordine ${orderId}`,
    body: [`Grazie per il tuo ordine ${orderId}.`, "", ...rows, "", `Totale: ${euro(totalCents)}`].join("\n"),
    eventId: event.id,
  };
}

export interface HandlerStats {
  received: number;
  emailsSent: number;
  failed: number;
  redelivered: number;
  ignored: number;
  duplicates: number; // lezione 8: eventi già gestiti, riconosciuti e saltati
}

type Log = {
  info: (obj: object, msg: string) => void;
  warn: (obj: object, msg: string) => void;
};

export function createHandler(
  mailer: Mailer,
  { seen, log }: { seen?: SeenStore; log?: Log } = {},
): Handler & { stats: () => HandlerStats } {
  const stats: HandlerStats = { received: 0, emailsSent: 0, failed: 0, redelivered: 0, ignored: 0, duplicates: 0 };

  const handler = async (event: EventEnvelope, { redelivered }: { redelivered: boolean; attempt?: number }) => {
    stats.received++;
    if (redelivered) stats.redelivered++;

    // Un evento che non ci interessa (o una versione che non conosciamo) si conferma e basta:
    // chi pubblica può aggiungere tipi nuovi senza rompere chi ascolta.
    if (event.type !== "OrderCreated" || event.version !== 1) {
      stats.ignored++;
      log?.info({ eventId: event.id, type: event.type, version: event.version }, "evento ignorato");
      return;
    }

    // Parte 2 · TODO 3: IDEMPOTENZA. Questo evento l'abbiamo già gestito?
    //   1. se c'è "seen": const claimed = await seen.claim(event.id)
    //      (in un try/catch: se Redis è giù, si manda lo stesso e si scrive un warning)
    //   2. claimed false? stats.duplicates++, un log, e return (consumeMessage farà ack)
    //   3. se mailer.send fallisce: await seen?.release(event.id) PRIMA di rilanciare l'errore,
    //      così il prossimo tentativo potrà mandare l'email
    void seen;
    try {
      await mailer.send(confirmationEmail(event as EventEnvelope & { data: OrderCreatedV1 }));
      stats.emailsSent++;
    } catch (err) {
      stats.failed++;
      throw err; // consumeMessage deciderà: nuovo tentativo o DLQ
    }
  };

  return Object.assign(handler, { stats: () => ({ ...stats }) });
}

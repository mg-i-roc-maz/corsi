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

    // IDEMPOTENZA: questo evento l'abbiamo già gestito?
    let claimed = true;
    if (seen) {
      try {
        claimed = await seen.claim(event.id);
      } catch (err) {
        // Redis giù: non possiamo controllare. Scelta: mandare comunque.
        // Meglio un'email doppia (rara) che nessuna email.
        log?.warn({ eventId: event.id, err: (err as Error).message }, "controllo doppioni non disponibile: mando lo stesso");
      }
    }
    if (!claimed) {
      stats.duplicates++;
      log?.info({ eventId: event.id, correlationId: event.correlationId }, "evento già gestito: doppione saltato");
      return; // consumeMessage farà ack: il doppione sparisce
    }

    try {
      await mailer.send(confirmationEmail(event as EventEnvelope & { data: OrderCreatedV1 }));
      stats.emailsSent++;
    } catch (err) {
      stats.failed++;
      // L'email non è partita: liberiamo l'id, così il prossimo tentativo potrà mandarla.
      await seen?.release(event.id).catch(() => {});
      throw err; // consumeMessage deciderà: nuovo tentativo o DLQ
    }
  };

  return Object.assign(handler, { stats: () => ({ ...stats }) });
}

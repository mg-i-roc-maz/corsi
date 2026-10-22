// Cosa fa notifications con ogni tipo di evento.
// Oggi uno solo: OrderCreated -> email di conferma al cliente.
import type { EventEnvelope, Handler } from "./consume.js";
import type { Mailer } from "./mailer.js";

// Il contratto di OrderCreated, versione 1, visto da chi lo riceve.
// È una COPIA di quello di orders: i servizi non condividono codice, condividono il contratto.
export interface OrderCreatedV1 {
  orderId: string;
  customerEmail: string;
  totalCents: number;
  lines: { productId: string; productName: string; quantity: number; unitPriceCents: number }[];
}

// Extra 3: la versione 2 cambia la forma: il cliente diventa un oggetto, e arriva la valuta.
// È un cambiamento che ROMPE chi legge la v1: per questo cambia il numero di versione.
export interface OrderCreatedV2 {
  orderId: string;
  customer: { email: string; name?: string };
  currency: string;
  totalCents: number;
  lines: OrderCreatedV1["lines"];
}

// Le versioni che notifications sa leggere. Le altre si ignorano (e si confermano).
export const SUPPORTED_VERSIONS = [1, 2];

// Porta qualsiasi versione conosciuta a una forma sola, quella che usa l'email.
export function normalize(event: EventEnvelope): OrderCreatedV1 & { name?: string } {
  if (event.version === 2) {
    const d = event.data as OrderCreatedV2;
    return { orderId: d.orderId, customerEmail: d.customer.email, name: d.customer.name, totalCents: d.totalCents, lines: d.lines };
  }
  return event.data as OrderCreatedV1;
}

const euro = (cents: number) => `${(cents / 100).toFixed(2).replace(".", ",")} €`;

export function confirmationEmail(event: EventEnvelope) {
  const { orderId, customerEmail, name, totalCents, lines } = normalize(event);
  const rows = lines.map((l) => `- ${l.quantity} × ${l.productName}: ${euro(l.quantity * l.unitPriceCents)}`);
  const greeting = name ? `Ciao ${name}, grazie per il tuo ordine ${orderId}.` : `Grazie per il tuo ordine ${orderId}.`;
  return {
    to: customerEmail,
    subject: `Conferma ordine ${orderId}`,
    body: [greeting, "", ...rows, "", `Totale: ${euro(totalCents)}`].join("\n"),
    eventId: event.id,
  };
}

export interface HandlerStats {
  received: number;
  emailsSent: number;
  failed: number;
  redelivered: number;
  ignored: number;
}

export function createHandler(
  mailer: Mailer,
  log?: { info: (obj: object, msg: string) => void },
): Handler & { stats: () => HandlerStats } {
  const stats: HandlerStats = { received: 0, emailsSent: 0, failed: 0, redelivered: 0, ignored: 0 };

  const handler = async (event: EventEnvelope, { redelivered }: { redelivered: boolean }) => {
    stats.received++;
    if (redelivered) stats.redelivered++;

    // Un evento che non ci interessa (o una versione che non conosciamo) si conferma e basta:
    // chi pubblica può aggiungere tipi nuovi senza rompere chi ascolta.
    if (event.type !== "OrderCreated" || !SUPPORTED_VERSIONS.includes(event.version)) {
      stats.ignored++;
      log?.info({ eventId: event.id, type: event.type, version: event.version }, "evento ignorato");
      return;
    }

    try {
      await mailer.send(confirmationEmail(event));
      stats.emailsSent++;
    } catch (err) {
      stats.failed++;
      throw err; // consumeMessage farà nack: il messaggio torna in coda
    }
  };

  return Object.assign(handler, { stats: () => ({ ...stats }) });
}

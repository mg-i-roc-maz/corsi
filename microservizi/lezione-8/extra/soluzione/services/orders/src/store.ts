// Archivio degli ordini, ora con l'OUTBOX (lezione 8).
//
// Il problema della lezione 7, la "doppia scrittura": l'ordine si salva, poi la
// pubblicazione su RabbitMQ fallisce. L'ordine c'è, l'evento no, l'email non parte mai.
//
// L'OUTBOX: l'evento si scrive NELLO STESSO archivio dell'ordine, nella STESSA operazione
// (con PostgreSQL: la stessa transazione). O ci sono tutti e due, o nessuno.
// Poi un "relay" (outbox.ts) legge gli eventi non ancora pubblicati e li manda a RabbitMQ.
//
// Due implementazioni con la stessa interfaccia: memoria (test, npm run dev)
// e PostgreSQL (store-postgres.ts, nel Compose).
import type { EventEnvelope } from "./events.js";

export interface OrderItem {
  productId: string;
  quantity: number;
}

// Una riga d'ordine "fotografa" nome e prezzo al momento dell'acquisto.
export interface OrderLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  lines: OrderLine[];
  totalCents: number;
  status: "confirmed" | "cancelled"; // Extra 4: un ordine si può annullare
  createdAt: string;
}

// Un evento in attesa di essere pubblicato.
export interface OutboxEntry {
  id: number; // progressivo: dice l'ordine di pubblicazione
  routingKey: string;
  event: EventEnvelope<unknown>;
  createdAt: string;
  publishedAt?: string;
}

// Gli eventi da scrivere insieme all'ordine: li costruisce chi chiama,
// perché servono dati (l'id dell'ordine) che esistono solo dopo il salvataggio.
export type EventsFor = (order: Order) => { routingKey: string; event: EventEnvelope<unknown> }[];

export interface OrderStore {
  list(): Promise<Order[]>;
  get(id: string): Promise<Order | undefined>;
  // L'ordine e i suoi eventi, insieme.
  create(customerEmail: string, lines: OrderLine[], eventsFor?: EventsFor): Promise<Order>;
  // Extra 4: annulla un ordine confermato, e scrive i suoi eventi. undefined se non esiste
  // o se non è più confermato (annullare due volte non annulla due volte).
  cancel(id: string, eventsFor?: EventsFor): Promise<Order | undefined>;
  // Extra 3: con più copie di orders, ogni giro del relay "prende" i suoi eventi.
  relayLocked?(limit: number, publish: (entry: OutboxEntry) => Promise<void>): Promise<number>;
  // Per il relay: i prossimi eventi da pubblicare, in ordine, e poi "fatto".
  pendingEvents(limit: number): Promise<OutboxEntry[]>;
  markPublished(ids: number[]): Promise<void>;
  outboxStats(): Promise<{ pending: number; published: number }>;
  ping(): Promise<void>;
  close(): Promise<void>;
}

export const totalOf = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + l.quantity * l.unitPriceCents, 0);

export function createOrderStore(): OrderStore & { outbox: OutboxEntry[] } {
  const orders = new Map<string, Order>();
  const outbox: OutboxEntry[] = [];
  let nextOrder = 1;
  let nextEvent = 1;
  return {
    outbox,
    list: async () => [...orders.values()],
    get: async (id) => orders.get(id),
    async create(customerEmail, lines, eventsFor) {
      const order: Order = {
        id: `o-${nextOrder++}`,
        customerEmail,
        lines,
        totalCents: totalOf(lines),
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      // In memoria "la stessa transazione" è semplice: nessun await tra le due scritture.
      orders.set(order.id, order);
      for (const { routingKey, event } of eventsFor?.(order) ?? []) {
        outbox.push({ id: nextEvent++, routingKey, event, createdAt: new Date().toISOString() });
      }
      return order;
    },
    async cancel(id, eventsFor) {
      const order = orders.get(id);
      if (!order || order.status !== "confirmed") return undefined;
      order.status = "cancelled";
      for (const { routingKey, event } of eventsFor?.(order) ?? []) {
        outbox.push({ id: nextEvent++, routingKey, event, createdAt: new Date().toISOString() });
      }
      return order;
    },
    async pendingEvents(limit) {
      return outbox.filter((e) => !e.publishedAt).slice(0, limit);
    },
    async markPublished(ids) {
      const now = new Date().toISOString();
      for (const entry of outbox) if (ids.includes(entry.id)) entry.publishedAt = now;
    },
    async outboxStats() {
      const pending = outbox.filter((e) => !e.publishedAt).length;
      return { pending, published: outbox.length - pending };
    },
    async ping() {},
    async close() {},
  };
}

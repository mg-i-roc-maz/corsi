// Il RELAY dell'outbox: ogni intervalMs prende gli eventi non ancora pubblicati
// e li manda a RabbitMQ, nell'ordine in cui sono stati scritti.
//
//   - pubblicato e confermato dal broker   -> segnato come pubblicato
//   - RabbitMQ giù                          -> ci si ferma: riproveremo al prossimo giro
//
// Garanzia: AT-LEAST-ONCE. Se il relay pubblica e cade PRIMA di segnare l'evento,
// al riavvio lo ripubblica. Per questo notifications è un consumer idempotente.
import type { OrderEvents } from "./events.js";
import type { OrderStore } from "./store.js";

type Log = {
  info: (obj: object, msg: string) => void;
  warn: (obj: object, msg: string) => void;
};

// UN giro del relay. Restituisce quanti eventi ha pubblicato.
export async function relayOnce(store: OrderStore, publisher: OrderEvents, { batch = 50, log }: { batch?: number; log?: Log } = {}) {
  const pending = await store.pendingEvents(batch);
  const published: number[] = [];
  try {
    for (const entry of pending) {
      await publisher.publish(entry.routingKey, entry.event);
      published.push(entry.id);
    }
  } catch (err) {
    // Il primo che fallisce ferma il giro: gli altri aspettano, per non cambiare l'ordine.
    log?.warn({ err: (err as Error).message, pending: pending.length - published.length }, "relay: RabbitMQ non disponibile, riprovo");
  }
  // Si segnano solo quelli confermati dal broker.
  await store.markPublished(published);
  return published.length;
}

export function startOutboxRelay({
  store,
  publisher,
  intervalMs = 500,
  batch = 50,
  log,
}: {
  store: OrderStore;
  publisher: OrderEvents;
  intervalMs?: number;
  batch?: number;
  log?: Log;
}) {
  let running = false;
  const timer = setInterval(async () => {
    if (running) return; // un giro alla volta
    running = true;
    try {
      const count = await relayOnce(store, publisher, { batch, log });
      if (count) log?.info({ count }, "relay: eventi pubblicati");
    } catch (err) {
      log?.warn({ err: (err as Error).message }, "relay: database non disponibile, riprovo");
    } finally {
      running = false;
    }
  }, intervalMs);
  return {
    stop() {
      clearInterval(timer);
    },
  };
}

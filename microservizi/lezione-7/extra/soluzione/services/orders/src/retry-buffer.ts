// Extra 4: se RabbitMQ non risponde, l'evento non si butta: si tiene da parte
// e si riprova ogni intervalMs. Meglio di prima, ma NON basta:
//   - il buffer è in memoria: se orders si riavvia, gli eventi in attesa sono persi
//   - con RabbitMQ giù a lungo, il buffer cresce (per questo c'è un massimo)
// La soluzione vera è salvare l'evento insieme all'ordine: l'Outbox, nella lezione 8.
import type { Order } from "./store.js";
import type { OrderEvents } from "./events.js";

export interface RetryBufferOptions {
  intervalMs?: number;
  max?: number; // oltre, gli eventi più vecchi si perdono (e si scrive nel log)
  log?: { warn: (obj: object, msg: string) => void };
}

export function withRetryBuffer(inner: OrderEvents, { intervalMs = 5000, max = 1000, log }: RetryBufferOptions = {}) {
  const pending: { order: Order; correlationId?: string }[] = [];

  async function flush() {
    while (pending.length > 0) {
      const next = pending[0];
      try {
        await inner.orderCreated(next.order, next.correlationId);
        pending.shift();
      } catch {
        return; // ancora giù: riproviamo al prossimo giro
      }
    }
  }

  const timer = setInterval(() => void flush(), intervalMs);
  timer.unref(); // il timer non tiene vivo il processo

  const events: OrderEvents & { pending(): number; flush(): Promise<void> } = {
    async orderCreated(order, correlationId) {
      // Prima quelli in attesa, per non cambiare l'ordine degli eventi.
      await flush();
      if (pending.length === 0) {
        try {
          await inner.orderCreated(order, correlationId);
          return;
        } catch {
          // giù: lo mettiamo da parte
        }
      }
      pending.push({ order, correlationId });
      if (pending.length > max) {
        const lost = pending.shift();
        log?.warn({ orderId: lost?.order.id }, "buffer pieno: evento OrderCreated perso");
      }
      log?.warn({ orderId: order.id, pending: pending.length }, "RabbitMQ giù: evento messo da parte");
    },
    connected: () => inner.connected(),
    pending: () => pending.length,
    flush,
    async close() {
      clearInterval(timer);
      await inner.close();
    },
  };
  return events;
}

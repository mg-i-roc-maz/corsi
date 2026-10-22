// INVALIDAZIONE TRA SERVIZI: quando un prodotto cambia, catalog lo annuncia
// su un canale Redis (PUBLISH). Chi tiene una copia del prodotto (orders)
// è iscritto al canale (SUBSCRIBE) e butta la sua copia.
//
// Redis Pub/Sub è "spara e dimentica": il messaggio arriva solo a chi è
// collegato IN QUEL MOMENTO. Se orders è spento, l'avviso è perso.
// Nella lezione 7 lo stesso avviso diventa un evento in una coda RabbitMQ,
// che lo conserva finché qualcuno non lo legge.
import { createClient } from "redis";

export const PRODUCT_CHANNEL = "catalog.products";

// Cosa è cambiato: chi ascolta decide cosa gli interessa.
// orders, per esempio, tiene nome e prezzo: le scorte che cambiano non lo riguardano.
export type ProductChange = "updated" | "deleted" | "stock";

export interface ProductChangedEvent {
  type: "ProductChanged";
  productId: string;
  change: ProductChange;
  at: string; // quando, in formato ISO
}

export interface ProductEvents {
  productChanged(productId: string, change: ProductChange): Promise<void>;
  close(): Promise<void>;
}

export function createRedisNotifier({
  url,
  log,
}: {
  url: string;
  log?: { warn: (obj: object, msg: string) => void };
}): ProductEvents {
  const client = createClient({
    url,
    disableOfflineQueue: true,
    socket: { connectTimeout: 2000, reconnectStrategy: (retries) => Math.min(100 * 2 ** retries, 2000) },
  });
  let lastWarn = 0;
  client.on("error", (err: Error) => {
    if (Date.now() - lastWarn > 5000) {
      lastWarn = Date.now();
      log?.warn({ err: err.message }, "Redis non disponibile: gli avvisi ProductChanged non partono");
    }
  });
  client.connect().catch(() => {});

  return {
    async productChanged(productId, change) {
      const event: ProductChangedEvent = { type: "ProductChanged", productId, change, at: new Date().toISOString() };
      // PUBLISH restituisce quanti iscritti hanno ricevuto il messaggio.
      await client.publish(PRODUCT_CHANNEL, JSON.stringify(event));
    },
    async close() {
      if (client.isOpen) await client.close();
    },
  };
}

// Per i test: ricorda gli avvisi invece di mandarli.
export function createMemoryNotifier(): ProductEvents & { sent: string[] } {
  const sent: string[] = [];
  return {
    sent,
    async productChanged(productId, change) {
      sent.push(`${productId}:${change}`);
    },
    async close() {},
  };
}

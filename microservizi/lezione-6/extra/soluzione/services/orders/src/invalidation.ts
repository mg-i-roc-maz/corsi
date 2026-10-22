// INVALIDAZIONE TRA SERVIZI, lato orders: ascolta gli avvisi di catalog.
//
// catalog pubblica sul canale Redis "catalog.products" un messaggio per ogni
// prodotto modificato:  {"type":"ProductChanged","productId":"p-1","change":"updated","at":"..."}
// orders è iscritto (SUBSCRIBE) e, per ogni avviso che lo riguarda, butta la sua copia.
//
// Redis Pub/Sub non conserva i messaggi: quelli arrivati mentre orders era spento
// o scollegato sono persi. Il TTL della cache locale copre questo caso.
import { createClient } from "redis";

export const PRODUCT_CHANNEL = "catalog.products";

export interface ProductChanged {
  productId: string;
  change: "updated" | "deleted" | "stock";
}

export interface SubscriptionOptions {
  url: string;
  onProductChanged: (event: ProductChanged) => void;
  // Extra 2: chiamata a ogni (ri)connessione. Gli avvisi arrivati mentre eravamo
  // scollegati sono persi: l'unica cosa sicura è buttare tutte le copie.
  onConnected?: () => void;
  log?: {
    info: (obj: object, msg: string) => void;
    warn: (obj: object, msg: string) => void;
  };
}

// Interpreta un messaggio del canale. Un messaggio che non si capisce viene scartato.
export function parseProductChanged(message: string): ProductChanged | undefined {
  try {
    const event = JSON.parse(message) as { type?: string; productId?: unknown; change?: unknown };
    if (event.type !== "ProductChanged" || typeof event.productId !== "string") return undefined;
    // Un avviso senza "change" (o con un valore che non conosciamo) vale come "updated":
    // nel dubbio, meglio buttare una copia buona che tenerne una vecchia.
    const change = event.change === "deleted" || event.change === "stock" ? event.change : "updated";
    return { productId: event.productId, change };
  } catch {
    // non è JSON
  }
  return undefined;
}

// Quali avvisi riguardano orders? orders tiene nome e prezzo; le prenotazioni
// vanno sempre a catalog. Se buttassimo la copia a ogni cambio di scorte
// (cioè a ogni ordine), la cache non servirebbe quasi mai.
export function concernsOrders(event: ProductChanged): boolean {
  return event.change !== "stock";
}

export function subscribeToProductChanges({ url, onProductChanged, onConnected, log }: SubscriptionOptions) {
  // Un client in modalità SUBSCRIBE non può fare altri comandi: ne serve uno dedicato.
  const subscriber = createClient({
    url,
    socket: { connectTimeout: 2000, reconnectStrategy: (retries) => Math.min(100 * 2 ** retries, 2000) },
  });
  let lastWarn = 0;
  subscriber.on("error", (err: Error) => {
    if (Date.now() - lastWarn > 5000) {
      lastWarn = Date.now();
      log?.warn({ err: err.message }, "Redis non disponibile: gli avvisi di catalog non arrivano, resta il TTL");
    }
  });
  // Dopo una riconnessione node-redis rinnova da solo le iscrizioni.
  subscriber.on("ready", () => {
    log?.info({ channel: PRODUCT_CHANNEL }, "in ascolto degli avvisi di catalog");
    onConnected?.();
  });

  // Non aspettiamo Redis: orders parte anche se Redis non c'è ancora.
  // L'iscrizione resta in attesa e parte appena la connessione è pronta.
  subscriber.connect().catch(() => {});
  subscriber
    .subscribe(PRODUCT_CHANNEL, (message) => {
      const event = parseProductChanged(message);
      if (!event) {
        log?.warn({ message }, "avviso di catalog non valido, scartato");
        return;
      }
      onProductChanged(event);
    })
    .catch((err: Error) => log?.warn({ err: err.message }, "iscrizione al canale di catalog fallita"));

  return {
    async close() {
      if (subscriber.isOpen) await subscriber.close();
    },
  };
}

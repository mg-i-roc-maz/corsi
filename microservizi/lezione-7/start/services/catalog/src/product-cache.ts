// CACHE-ASIDE per i prodotti (lezione 5), con due novità della lezione 6:
//
//   1. SINGLE FLIGHT contro lo stampede: se cento richieste fanno MISS sulla
//      stessa chiave nello stesso istante, al database ne va UNA sola.
//      Le altre aspettano il suo risultato.
//   2. INVALIDAZIONE TRA SERVIZI: quando un prodotto cambia, catalog lo annuncia
//      (evento ProductChanged) a chi ne tiene una copia, per esempio orders.
//
// La cache resta un'ottimizzazione, non una dipendenza: se Redis è giù,
// si legge dal database e basta (BYPASS).
import type { Cache } from "./cache.js";
import type { ProductChange, ProductEvents } from "./notifier.js";
import type { Product, ProductStore } from "./store/index.js";

export type CacheOutcome = "HIT" | "MISS" | "BYPASS";

export interface ProductCacheOptions {
  ttlSeconds: number;
  // Chi va avvisato quando un prodotto cambia (orders). Senza, nessun avviso.
  events?: ProductEvents;
  log?: { warn: (obj: object, msg: string) => void };
}

export const productKey = (id: string) => `product:${id}`;

export function createProductCache(cache: Cache, { ttlSeconds, events, log }: ProductCacheOptions) {
  // dbReads: quante letture sono arrivate davvero al database.
  // coalesced: quante richieste hanno aspettato una lettura già in corso.
  const stats = { hits: 0, misses: 0, errors: 0, dbReads: 0, coalesced: 0 };

  // Le letture dal database in corso, una per chiave.
  const inFlight = new Map<string, Promise<Product | undefined>>();

  // Legge dal database e salva la copia in cache.
  async function load(store: ProductStore, id: string, key: string, saveInCache: boolean) {
    stats.dbReads++;
    const product = await store.get(id);
    if (product && saveInCache) {
      try {
        await cache.set(key, JSON.stringify(product), ttlSeconds);
      } catch (err) {
        stats.errors++;
        log?.warn({ key, err: (err as Error).message }, "impossibile salvare in cache");
      }
    }
    return product;
  }

  return {
    async getProduct(store: ProductStore, id: string): Promise<{ product: Product | undefined; cache: CacheOutcome }> {
      const key = productKey(id);

      let cached: string | null = null;
      let cacheWorks = true;
      try {
        cached = await cache.get(key);
      } catch (err) {
        cacheWorks = false;
        stats.errors++;
        log?.warn({ key, err: (err as Error).message }, "cache non disponibile, leggo dal database");
      }

      if (cached !== null) {
        stats.hits++;
        return { product: JSON.parse(cached) as Product, cache: "HIT" };
      }
      if (cacheWorks) stats.misses++;

      // SINGLE FLIGHT: c'è già una lettura in corso per questa chiave? Aspettiamo quella.
      const running = inFlight.get(key);
      if (running) {
        stats.coalesced++;
        return { product: await running, cache: cacheWorks ? "MISS" : "BYPASS" };
      }
      // Altrimenti la facciamo noi, e la registriamo perché le altre possano aspettarla.
      const reading = load(store, id, key, cacheWorks);
      inFlight.set(key, reading);
      try {
        return { product: await reading, cache: cacheWorks ? "MISS" : "BYPASS" };
      } finally {
        // Finita (bene o male): la prossima richiesta ricomincia dalla cache.
        inFlight.delete(key);
      }
    },

    // INVALIDAZIONE: la copia in Redis va buttata, e chi ha copie sue va avvisato.
    async invalidate(id: string, change: ProductChange = "updated"): Promise<void> {
      try {
        await cache.del(productKey(id));
      } catch (err) {
        stats.errors++;
        log?.warn({ id, err: (err as Error).message }, "invalidazione fallita: dato vecchio fino al TTL");
      }
      // L'avviso è "al massimo una volta": se nessuno ascolta, si perde.
      // Per questo anche le copie degli altri servizi hanno un TTL.
      try {
        await events?.productChanged(id, change);
      } catch (err) {
        log?.warn({ id, err: (err as Error).message }, "avviso ProductChanged non inviato");
      }
    },

    stats() {
      const lookups = stats.hits + stats.misses;
      return { ...stats, hitRatio: lookups ? Math.round((stats.hits / lookups) * 1000) / 1000 : 0, ttlSeconds };
    },
  };
}

export type ProductCache = ReturnType<typeof createProductCache>;

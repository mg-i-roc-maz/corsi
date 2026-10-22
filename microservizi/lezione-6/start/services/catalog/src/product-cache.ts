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

      // Parte 4 · TODO 3: SINGLE FLIGHT. Per ora ogni MISS va al database.
      //   1. c'è già una lettura in corso per questa chiave (inFlight.get(key))?
      //      stats.coalesced++ e aspetta QUELLA:  { product: await running, cache: ... }
      //   2. altrimenti: const reading = load(...);  inFlight.set(key, reading);
      //   3. aspetta reading dentro un try, e nel finally togli la chiave da inFlight
      //      (anche se la lettura fallisce, la prossima richiesta deve poter riprovare)
      void inFlight;
      const product = await load(store, id, key, cacheWorks);
      return { product, cache: cacheWorks ? "MISS" : "BYPASS" };
    },

    // INVALIDAZIONE: la copia in Redis va buttata, e chi ha copie sue va avvisato.
    async invalidate(id: string, change: ProductChange = "updated"): Promise<void> {
      try {
        await cache.del(productKey(id));
      } catch (err) {
        stats.errors++;
        log?.warn({ id, err: (err as Error).message }, "invalidazione fallita: dato vecchio fino al TTL");
      }
      // Parte 5 · TODO 5: avvisa gli altri servizi che il prodotto è cambiato.
      //   events?.productChanged(id, change), dentro un try/catch:
      //   se l'avviso non parte, la modifica è comunque salvata (log?.warn e basta).
      void events;
      void change;
    },

    stats() {
      const lookups = stats.hits + stats.misses;
      return { ...stats, hitRatio: lookups ? Math.round((stats.hits / lookups) * 1000) / 1000 : 0, ttlSeconds };
    },
  };
}

export type ProductCache = ReturnType<typeof createProductCache>;

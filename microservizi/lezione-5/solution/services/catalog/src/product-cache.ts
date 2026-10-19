// CACHE-ASIDE per i prodotti: è il codice di catalog a gestire la cache.
//
//   lettura:   1. cerca in cache   2. se c'è (HIT) usala
//              3. se non c'è (MISS) leggi dal database e mettila in cache, con un TTL
//   scrittura: 1. scrivi nel database   2. cancella la copia in cache (invalidazione)
//
// La cache è un'ottimizzazione, non una dipendenza: se Redis è giù,
// si legge dal database e basta (BYPASS).
import type { Cache } from "./cache.js";
import type { Product, ProductStore } from "./store/index.js";

export type CacheOutcome = "HIT" | "MISS" | "BYPASS";

export interface ProductCacheOptions {
  ttlSeconds: number;
  log?: { warn: (obj: object, msg: string) => void };
}

// Le chiavi hanno un prefisso: in Redis si leggono come "cartelle" (product:p-1, product:p-2...).
export const productKey = (id: string) => `product:${id}`;

export function createProductCache(cache: Cache, { ttlSeconds, log }: ProductCacheOptions) {
  const stats = { hits: 0, misses: 0, errors: 0 };

  return {
    async getProduct(store: ProductStore, id: string): Promise<{ product: Product | undefined; cache: CacheOutcome }> {
      const key = productKey(id);

      // 1. Cerca in cache
      let cached: string | null = null;
      let cacheWorks = true;
      try {
        cached = await cache.get(key);
      } catch (err) {
        cacheWorks = false;
        stats.errors++;
        log?.warn({ key, err: (err as Error).message }, "cache non disponibile, leggo dal database");
      }

      // 2. HIT: la copia c'è, il database non viene nemmeno toccato
      if (cached !== null) {
        stats.hits++;
        return { product: JSON.parse(cached) as Product, cache: "HIT" };
      }

      // 3. MISS: leggi dal database...
      const product = await store.get(id);
      if (!cacheWorks) return { product, cache: "BYPASS" };
      stats.misses++;

      // ...e salva la copia per le prossime richieste, con una scadenza.
      if (product) {
        try {
          await cache.set(key, JSON.stringify(product), ttlSeconds);
        } catch (err) {
          stats.errors++;
          log?.warn({ key, err: (err as Error).message }, "impossibile salvare in cache");
        }
      }
      return { product, cache: "MISS" };
    },

    // INVALIDAZIONE: dopo ogni modifica, la copia in cache va buttata.
    // La prossima lettura sarà un MISS e prenderà il dato aggiornato.
    async invalidate(id: string): Promise<void> {
      try {
        await cache.del(productKey(id));
      } catch (err) {
        stats.errors++;
        // Se non riusciamo a cancellare, la copia vecchia resta fino alla scadenza del TTL.
        log?.warn({ id, err: (err as Error).message }, "invalidazione fallita: dato vecchio fino al TTL");
      }
    },

    stats() {
      const lookups = stats.hits + stats.misses;
      return { ...stats, hitRatio: lookups ? Math.round((stats.hits / lookups) * 1000) / 1000 : 0, ttlSeconds };
    },
  };
}

export type ProductCache = ReturnType<typeof createProductCache>;

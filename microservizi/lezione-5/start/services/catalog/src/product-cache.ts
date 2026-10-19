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

      // Parte 2 · TODO 1: il cache-aside. Per ora si legge SEMPRE dal database.
      //   1. prova cache.get(key), dentro un try/catch: se la cache è giù,
      //      stats.errors++, un log?.warn(...) e si continua con il database
      //   2. se c'è un valore: stats.hits++ e restituisci
      //      { product: JSON.parse(valore), cache: "HIT" }
      //   3. altrimenti leggi dal database con store.get(id)
      //      - se la cache era giù: restituisci { product, cache: "BYPASS" }
      //      - se no: stats.misses++, salva con cache.set(key, JSON.stringify(product), ttlSeconds)
      //        (solo se il prodotto esiste, e anche questo in un try/catch)
      //        e restituisci { product, cache: "MISS" }
      void key;
      void ttlSeconds;
      const product = await store.get(id);
      return { product, cache: "BYPASS" };
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

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
  // Extra 1: per quanto ricordare che un prodotto NON esiste (0 = mai)
  negativeTtlSeconds?: number;
  // Extra 2: variazione casuale del TTL, in percentuale (10 = ±10%)
  ttlJitterPercent?: number;
  random?: () => number;
  log?: { warn: (obj: object, msg: string) => void };
}

// Le chiavi hanno un prefisso: in Redis si leggono come "cartelle" (product:p-1, product:p-2...).
export const productKey = (id: string) => `product:${id}`;
// Extra 3: la lista completa dei prodotti, una sola chiave
export const LIST_KEY = "products:all";
// Extra 1: il valore che significa "questo prodotto non esiste"
const NOT_FOUND = "__non_esiste__";

export function createProductCache(
  cache: Cache,
  { ttlSeconds, log, negativeTtlSeconds = 0, ttlJitterPercent = 0, random = Math.random }: ProductCacheOptions,
) {
  const stats = { hits: 0, misses: 0, errors: 0 };

  // Extra 2: TTL con jitter. Chiavi salvate insieme non scadono tutte nello stesso secondo.
  const ttl = () => {
    if (!ttlJitterPercent) return ttlSeconds;
    const factor = 1 + ((random() * 2 - 1) * ttlJitterPercent) / 100;
    return Math.max(1, Math.round(ttlSeconds * factor));
  };

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
        // Extra 1: anche "non esiste" è un'informazione che si può tenere in cache.
        if (cached === NOT_FOUND) return { product: undefined, cache: "HIT" };
        return { product: JSON.parse(cached) as Product, cache: "HIT" };
      }

      // 3. MISS: leggi dal database...
      const product = await store.get(id);
      if (!cacheWorks) return { product, cache: "BYPASS" };
      stats.misses++;

      // ...e salva la copia per le prossime richieste, con una scadenza.
      if (product || negativeTtlSeconds > 0) {
        try {
          if (product) await cache.set(key, JSON.stringify(product), ttl());
          else await cache.set(key, NOT_FOUND, negativeTtlSeconds);
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
        // Extra 3: cambia un prodotto, quindi cambia anche la lista.
        await cache.del(productKey(id), LIST_KEY);
      } catch (err) {
        stats.errors++;
        // Se non riusciamo a cancellare, la copia vecchia resta fino alla scadenza del TTL.
        log?.warn({ id, err: (err as Error).message }, "invalidazione fallita: dato vecchio fino al TTL");
      }
    },

    // Extra 3: la lista completa (senza filtro) in cache, sotto una sola chiave.
    async getList(store: ProductStore): Promise<{ products: Product[]; cache: CacheOutcome }> {
      try {
        const cached = await cache.get(LIST_KEY);
        if (cached !== null) {
          stats.hits++;
          return { products: JSON.parse(cached) as Product[], cache: "HIT" };
        }
      } catch (err) {
        stats.errors++;
        return { products: await store.list(), cache: "BYPASS" };
      }
      stats.misses++;
      const products = await store.list();
      await cache.set(LIST_KEY, JSON.stringify(products), ttl()).catch(() => {
        stats.errors++;
      });
      return { products, cache: "MISS" };
    },

    // Extra 3: un prodotto nuovo cambia la lista.
    async invalidateList(): Promise<void> {
      await cache.del(LIST_KEY).catch(() => {
        stats.errors++;
      });
    },

    // Extra 4: WRITE-THROUGH. Invece di cancellare la copia, la si sostituisce con il valore nuovo.
    async write(product: Product): Promise<void> {
      try {
        await cache.set(productKey(product.id), JSON.stringify(product), ttl());
        await cache.del(LIST_KEY);
      } catch (err) {
        stats.errors++;
        await cache.del(productKey(product.id)).catch(() => {});
      }
    },

    stats() {
      const lookups = stats.hits + stats.misses;
      return { ...stats, hitRatio: lookups ? Math.round((stats.hits / lookups) * 1000) / 1000 : 0, ttlSeconds };
    },
  };
}

export type ProductCache = ReturnType<typeof createProductCache>;

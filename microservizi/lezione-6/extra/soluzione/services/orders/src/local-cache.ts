// CACHE LOCALE dei prodotti, dentro il processo di orders.
//
// Ogni riga di un ordine chiede a catalog nome e prezzo: una chiamata di rete,
// con timeout, retry e circuito. Se lo stesso prodotto è stato letto da poco,
// orders usa la sua copia, senza chiamare catalog.
//
// Il problema: catalog cambia un prezzo, e orders continua a usare quello vecchio.
// Due difese, insieme:
//   1. un TTL: la copia scade comunque dopo ttlMs
//   2. l'avviso ProductChanged di catalog: chi lo riceve butta subito la copia
//      (invalidation.ts)
//
// Le prenotazioni (reserve) NON passano dalla cache: vanno sempre a catalog.
import type { CallContext, CatalogClient, CatalogProduct } from "./catalog-client.js";

export interface LocalCacheOptions {
  ttlMs: number; // 0 = cache spenta
  now?: () => number; // per i test: un orologio finto
}

export interface CachedCatalogClient extends CatalogClient {
  invalidate(productId: string): void;
  // Extra 2: butta tutte le copie
  clear(): void;
  cacheStats(): { hits: number; misses: number; invalidations: number; size: number; ttlMs: number };
}

export function withLocalCache(inner: CatalogClient, { ttlMs, now = Date.now }: LocalCacheOptions): CachedCatalogClient {
  const entries = new Map<string, { product: CatalogProduct; expiresAt: number }>();
  const stats = { hits: 0, misses: 0, invalidations: 0 };

  return {
    async getProduct(id: string, ctx?: CallContext) {
      const entry = entries.get(id);
      if (entry && entry.expiresAt > now()) {
        stats.hits++;
        return { ...entry.product };
      }
      stats.misses++;
      const product = await inner.getProduct(id, ctx);
      // Si tengono solo i prodotti che esistono; un 404 si richiede ogni volta.
      if (product && ttlMs > 0) entries.set(id, { product: { ...product }, expiresAt: now() + ttlMs });
      return product;
    },

    reserve(id, quantity, ctx) {
      return inner.reserve(id, quantity, ctx);
    },

    circuitState() {
      return inner.circuitState?.() ?? "unknown";
    },

    invalidate(productId: string) {
      if (entries.delete(productId)) stats.invalidations++;
    },

    clear() {
      stats.invalidations += entries.size;
      entries.clear();
    },

    cacheStats() {
      return { ...stats, size: entries.size, ttlMs };
    },
  };
}

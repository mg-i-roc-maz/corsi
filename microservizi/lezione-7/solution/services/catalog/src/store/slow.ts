// Simula un database lento: ogni LETTURA aspetta delayMs prima di rispondere.
// La nostra tabella ha tre righe e risponde in un millisecondo; nella realtà
// una lettura può costare decine o centinaia di millisecondi (join, tabelle
// enormi, un database lontano). Con DB_DELAY_MS l'effetto della cache si vede.
import type { ProductStore } from "./types.js";

export function withSlowReads(store: ProductStore, delayMs: number): ProductStore {
  if (!delayMs) return store;
  const wait = () => new Promise((resolve) => setTimeout(resolve, delayMs));
  return {
    ...store,
    async list(query) {
      await wait();
      return store.list(query);
    },
    async get(id) {
      await wait();
      return store.get(id);
    },
  };
}

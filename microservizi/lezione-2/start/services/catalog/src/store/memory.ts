// Archivio in memoria: è quello della lezione 1, ora dietro l'interfaccia
// ProductStore. Lo usano i test e "npm run dev" quando DATABASE_URL non c'è.
// I dati spariscono a ogni riavvio.
import { initialProducts, type Product, type ProductInput, type ProductStore } from "./types.js";

export function createMemoryStore(): ProductStore {
  const products = new Map<string, Product>();
  let nextId = 1;

  const store: ProductStore = {
    async list(query) {
      const all = [...products.values()];
      if (!query) return all;
      const q = query.toLowerCase();
      return all.filter((p) => p.name.toLowerCase().includes(q));
    },
    async get(id) {
      return products.get(id);
    },
    async create(input) {
      const product: Product = { id: `p-${nextId++}`, ...input };
      products.set(product.id, product);
      return product;
    },
    async replace(id, input) {
      if (!products.has(id)) return undefined;
      const product: Product = { id, ...input };
      products.set(id, product);
      return product;
    },
    async remove(id) {
      return products.delete(id);
    },
    async close() {},
  };

  for (const p of initialProducts) void store.create(p);
  return store;
}

export type { ProductInput };

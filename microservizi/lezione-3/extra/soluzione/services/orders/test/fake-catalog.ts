// Un catalog finto, in memoria, per testare orders senza avviare il vero catalog.
import { CatalogUnavailableError, type CatalogClient, type CatalogProduct } from "../src/catalog-client.js";

export function fakeCatalog(options: { down?: boolean } = {}): CatalogClient & { products: Map<string, CatalogProduct> } {
  const products = new Map<string, CatalogProduct>([
    ["p-1", { id: "p-1", name: "Tastiera meccanica", priceCents: 8990, stock: 12 }],
    ["p-2", { id: "p-2", name: "Mouse wireless", priceCents: 3990, stock: 30 }],
    ["p-3", { id: "p-3", name: "Monitor 27\"", priceCents: 27900, stock: 1 }],
  ]);
  const check = () => {
    if (options.down) throw new CatalogUnavailableError("catalog spento (finto)");
  };
  return {
    products,
    async getProduct(id) {
      check();
      const p = products.get(id);
      return p && { ...p };
    },
    async getProducts(ids) {
      check();
      return ids.flatMap((id) => {
        const p = products.get(id);
        return p ? [{ ...p }] : [];
      });
    },
    async release(id, quantity) {
      check();
      const p = products.get(id);
      if (p) p.stock += quantity;
    },
    async reserve(id, quantity) {
      check();
      const p = products.get(id);
      if (!p) return { status: "not_found" };
      if (p.stock < quantity) return { status: "insufficient_stock", available: p.stock };
      p.stock -= quantity;
      return { status: "reserved" };
    },
  };
}

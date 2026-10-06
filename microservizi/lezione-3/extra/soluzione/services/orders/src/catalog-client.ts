// Client HTTP verso il servizio catalog.
// orders non legge più il database dei prodotti: CHIEDE a catalog, via HTTP.
// Tutto quello che orders sa di catalog sta in questo file.

// La forma di un prodotto come la restituisce catalog: è il "contratto" tra i due servizi.
export interface CatalogProduct {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
}

export type ReservationResult =
  | { status: "reserved" }
  | { status: "not_found" }
  | { status: "insufficient_stock"; available: number };

export interface CatalogClient {
  getProduct(id: string): Promise<CatalogProduct | undefined>;
  reserve(id: string, quantity: number): Promise<ReservationResult>;
  // Extra 1: annulla una prenotazione (compensazione)
  release(id: string, quantity: number): Promise<void>;
  // Extra 2: tutti i prodotti dell'ordine in UNA chiamata
  getProducts(ids: string[]): Promise<CatalogProduct[]>;
}

// catalog non risponde, o risponde con un errore che non sappiamo gestire.
export class CatalogUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogUnavailableError";
  }
}

export function createHttpCatalogClient(baseUrl: string): CatalogClient {
  // fetch lancia un'eccezione se la connessione fallisce (catalog spento, nome sbagliato...).
  async function call(path: string, init?: RequestInit): Promise<Response> {
    try {
      return await fetch(`${baseUrl}${path}`, init);
    } catch (err) {
      throw new CatalogUnavailableError(`catalog non raggiungibile su ${baseUrl}: ${(err as Error).message}`);
    }
  }

  return {
    async getProduct(id) {
      const res = await call(`/products/${encodeURIComponent(id)}`);
      if (res.status === 404) return undefined;
      if (!res.ok) throw new CatalogUnavailableError(`catalog ha risposto ${res.status}`);
      return (await res.json()) as CatalogProduct;
    },

    async reserve(id, quantity) {
      const res = await call(`/products/${encodeURIComponent(id)}/reservations`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (res.status === 404) return { status: "not_found" };
      if (res.status === 409) {
        const body = (await res.json()) as { available: number };
        return { status: "insufficient_stock", available: body.available };
      }
      if (!res.ok) throw new CatalogUnavailableError(`catalog ha risposto ${res.status}`);
      return { status: "reserved" };
    },

    async release(id, quantity) {
      const res = await call(`/products/${encodeURIComponent(id)}/releases`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new CatalogUnavailableError(`catalog ha risposto ${res.status} al rilascio`);
    },

    async getProducts(ids) {
      const query = new URLSearchParams({ ids: ids.join(",") });
      const res = await call(`/products?${query}`);
      if (!res.ok) throw new CatalogUnavailableError(`catalog ha risposto ${res.status}`);
      return (await res.json()) as CatalogProduct[];
    },
  };
}

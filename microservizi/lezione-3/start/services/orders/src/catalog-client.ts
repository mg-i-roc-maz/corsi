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
      // Parte 2 · TODO 1: chiama GET /products/:id con la funzione call().
      // - 404            -> restituisci undefined (il prodotto non esiste)
      // - altro errore   -> lancia CatalogUnavailableError (res.ok è false per 4xx e 5xx)
      // - 200            -> restituisci il corpo JSON come CatalogProduct
      // Suggerimento: per un id usa encodeURIComponent(id) nell'URL.
      throw new Error("TODO: getProduct");
    },

    async reserve(id, quantity) {
      // Parte 2 · TODO 2: chiama POST /products/:id/reservations con corpo { quantity }.
      // Serve: method "POST", header content-type: application/json, body JSON.stringify(...).
      // - 404 -> { status: "not_found" }
      // - 409 -> { status: "insufficient_stock", available: <campo available del corpo> }
      // - altro errore -> lancia CatalogUnavailableError
      // - 200 -> { status: "reserved" }
      throw new Error("TODO: reserve");
    },
  };
}

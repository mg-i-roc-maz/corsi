// Client HTTP verso il servizio catalog, ora RESILIENTE:
//   1. timeout        nessuna chiamata aspetta più di CATALOG_TIMEOUT_MS
//   2. retry          le LETTURE si riprovano, con backoff esponenziale e jitter
//   3. circuit breaker se catalog sbaglia troppo, smettiamo di chiamarlo per un po'
//   4. correlation ID ogni chiamata porta l'header x-request-id della richiesta originale
import CircuitBreaker from "opossum";
import { withRetry } from "./retry.js";

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

// Il contesto della richiesta in corso: serve a propagare il correlation ID.
export interface CallContext {
  requestId?: string;
}

export interface CatalogClient {
  getProduct(id: string, ctx?: CallContext): Promise<CatalogProduct | undefined>;
  reserve(id: string, quantity: number, ctx?: CallContext): Promise<ReservationResult>;
  // Stato del circuito, per /health e per i log: "closed", "open" o "half-open".
  circuitState?(): string;
}

export type FailureKind = "unreachable" | "timeout" | "server_error" | "circuit_open";

// catalog non risponde, risponde male, o il circuito è aperto.
export class CatalogUnavailableError extends Error {
  constructor(
    message: string,
    readonly kind: FailureKind = "unreachable",
  ) {
    super(message);
    this.name = "CatalogUnavailableError";
  }
}

export interface HttpCatalogClientOptions {
  baseUrl: string;
  timeoutMs?: number;
  retries?: number;
  retryBaseMs?: number;
  breaker?: { errorThresholdPercentage: number; volumeThreshold: number; resetTimeoutMs: number; windowMs?: number };
  log?: { warn: (obj: object, msg: string) => void };
}

export function createHttpCatalogClient(options: HttpCatalogClientOptions): CatalogClient {
  const { baseUrl, timeoutMs = 2000, retries = 2, retryBaseMs = 100, log } = options;
  const breakerOptions = options.breaker ?? { errorThresholdPercentage: 50, volumeThreshold: 5, resetTimeoutMs: 10000 };

  // UNA chiamata HTTP, con timeout. Lancia CatalogUnavailableError per tutto ciò
  // che è colpa di catalog (rete, lentezza, 5xx). 404 e 409 NON sono errori:
  // sono risposte normali del contratto, e non devono aprire il circuito.
  async function call(path: string, init: RequestInit, ctx?: CallContext): Promise<Response> {
    let res: Response;
    try {
      res = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: { ...(init.headers as Record<string, string>), ...(ctx?.requestId ? { "x-request-id": ctx.requestId } : {}) },
        // Parte 2 · TODO 1: aggiungi un timeout di timeoutMs millisecondi.
        //   fetch accetta l'opzione  signal: AbortSignal.timeout(millisecondi)
      });
    } catch (err) {
      // Parte 2 · TODO 1: quando scatta il timeout, err.name è "TimeoutError".
      //   In quel caso lancia CatalogUnavailableError con kind "timeout"
      //   e un messaggio come `catalog non ha risposto entro ${timeoutMs} ms`.
      throw new CatalogUnavailableError(`catalog non raggiungibile su ${baseUrl}: ${(err as Error).message}`);
    }
    if (res.status >= 500) {
      throw new CatalogUnavailableError(`catalog ha risposto ${res.status}`, "server_error");
    }
    return res;
  }

  // Parte 4 · TODO 4: il CIRCUIT BREAKER.
  // 1. Crea il breaker intorno a call():
  //      const breaker = new CircuitBreaker(call, {
  //        timeout: false,                      // il timeout c'è già in call()
  //        errorThresholdPercentage: ...,       // da breakerOptions
  //        volumeThreshold: ...,
  //        resetTimeout: ...,                   // resetTimeoutMs
  //        rollingCountTimeout: breakerOptions.windowMs ?? 30000,
  //      });
  // 2. In guarded() usa  breaker.fire(path, init, ctx)  al posto di call(...).
  //    Se breaker.fire fallisce con il circuito aperto (breaker.opened è true) e l'errore
  //    NON è già un CatalogUnavailableError, lancia CatalogUnavailableError con kind "circuit_open".
  // 3. In circuitState() restituisci "open", "half-open" o "closed"
  //    (breaker.opened, breaker.halfOpen).
  // 4. Facoltativo: con breaker.on("open", ...) scrivi nel log quando il circuito cambia stato.
  void breakerOptions;
  void CircuitBreaker;

  async function guarded(path: string, init: RequestInit, ctx?: CallContext): Promise<Response> {
    return call(path, init, ctx);
  }

  // Si riprova solo quando ha senso: errori di catalog, ma non a circuito aperto.
  const retryable = (err: unknown) => err instanceof CatalogUnavailableError && err.kind !== "circuit_open";

  return {
    async getProduct(id, ctx) {
      // GET è idempotente: ripeterla non fa danni, quindi si può riprovare.
      // Parte 3 · TODO 3: avvolgi questa chiamata in withRetry(() => ..., { retries, baseMs: retryBaseMs,
      //   shouldRetry: retryable, onRetry: ... }) così una lettura fallita viene ripetuta.
      //   In onRetry scrivi un log: log?.warn({ productId: id, attempt, delayMs }, "nuovo tentativo verso catalog")
      const res = await guarded(`/products/${encodeURIComponent(id)}`, { method: "GET" }, ctx);
      void withRetry;
      void retryable;
      if (res.status === 404) return undefined;
      if (!res.ok) throw new CatalogUnavailableError(`catalog ha risposto ${res.status}`, "server_error");
      return (await res.json()) as CatalogProduct;
    },

    async reserve(id, quantity, ctx) {
      // POST NON è idempotente: se la prima prenotazione è arrivata ma la risposta
      // si è persa, riprovare toglierebbe le scorte DUE volte. Quindi: nessun retry.
      const res = await guarded(
        `/products/${encodeURIComponent(id)}/reservations`,
        { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ quantity }) },
        ctx,
      );
      if (res.status === 404) return { status: "not_found" };
      if (res.status === 409) {
        const body = (await res.json()) as { available: number };
        return { status: "insufficient_stock", available: body.available };
      }
      if (!res.ok) throw new CatalogUnavailableError(`catalog ha risposto ${res.status}`, "server_error");
      return { status: "reserved" };
    },

    circuitState() {
      return "closed"; // Parte 4 · TODO 4, punto 3
    },
  };
}

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
  stale?: boolean; // Extra 4: vero se il dato viene dal fallback e non da catalog
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
  // Extra 1: numeri del circuito, per /health/ready
  circuitStats?(): { fires: number; failures: number; timeouts: number; rejects: number; successes: number };
}

export type FailureKind = "unreachable" | "timeout" | "server_error" | "circuit_open" | "too_busy";

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
  // Extra 2: al massimo tante chiamate contemporanee verso catalog (bulkhead)
  maxConcurrent?: number;
  // Extra 4: se catalog non risponde, usare l'ultimo prodotto letto (al massimo così vecchio)
  fallbackMaxAgeMs?: number;
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
        // TIMEOUT: dopo timeoutMs la richiesta viene interrotta.
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      if ((err as Error).name === "TimeoutError") {
        throw new CatalogUnavailableError(`catalog non ha risposto entro ${timeoutMs} ms`, "timeout");
      }
      throw new CatalogUnavailableError(`catalog non raggiungibile su ${baseUrl}: ${(err as Error).message}`);
    }
    if (res.status >= 500) {
      throw new CatalogUnavailableError(`catalog ha risposto ${res.status}`, "server_error");
    }
    return res;
  }

  // CIRCUIT BREAKER: conta i fallimenti di call(). Quando sono troppi si apre
  // e per resetTimeoutMs rifiuta subito le chiamate, senza disturbare catalog.
  const breaker = new CircuitBreaker(call, {
    timeout: false, // il timeout lo gestisce già AbortSignal dentro call()
    errorThresholdPercentage: breakerOptions.errorThresholdPercentage,
    volumeThreshold: breakerOptions.volumeThreshold,
    resetTimeout: breakerOptions.resetTimeoutMs,
    // La finestra in cui si contano chiamate ed errori (il default di opossum è 10 s).
    rollingCountTimeout: breakerOptions.windowMs ?? 30000,
    // Extra 2: BULKHEAD. Oltre maxConcurrent chiamate in corso, le nuove vengono
    // rifiutate subito: un catalog lento non può occupare tutte le risorse di orders.
    capacity: options.maxConcurrent ?? Number.MAX_SAFE_INTEGER,
  });
  breaker.on("open", () => log?.warn({ circuit: "open" }, "circuito verso catalog APERTO"));
  breaker.on("halfOpen", () => log?.warn({ circuit: "half-open" }, "circuito verso catalog: chiamata di prova"));
  breaker.on("close", () => log?.warn({ circuit: "closed" }, "circuito verso catalog chiuso"));

  async function guarded(path: string, init: RequestInit, ctx?: CallContext): Promise<Response> {
    try {
      return await breaker.fire(path, init, ctx);
    } catch (err) {
      if (breaker.opened && !(err instanceof CatalogUnavailableError)) {
        throw new CatalogUnavailableError("circuito aperto: catalog non viene chiamato", "circuit_open");
      }
      if ((err as { code?: string }).code === "ESEMLOCKED") {
        throw new CatalogUnavailableError("troppe chiamate contemporanee verso catalog", "too_busy");
      }
      throw err;
    }
  }

  // Si riprova solo quando ha senso: errori di catalog, ma non a circuito aperto.
  const retryable = (err: unknown) =>
    err instanceof CatalogUnavailableError && err.kind !== "circuit_open" && err.kind !== "too_busy";

  // Extra 4: l'ultima versione letta di ogni prodotto, con l'ora della lettura.
  const lastKnown = new Map<string, { product: CatalogProduct; at: number }>();
  const fallbackMaxAgeMs = options.fallbackMaxAgeMs ?? 0;

  return {
    async getProduct(id, ctx) {
      // GET è idempotente: ripeterla non fa danni, quindi si può riprovare.
      let res: Response;
      try {
        res = await withRetry(() => guarded(`/products/${encodeURIComponent(id)}`, { method: "GET" }, ctx), {
        retries,
        baseMs: retryBaseMs,
        shouldRetry: retryable,
        onRetry: (err, attempt, delayMs) =>
          log?.warn({ productId: id, attempt, delayMs, reason: (err as Error).message }, "nuovo tentativo verso catalog"),
        });
      } catch (err) {
        // Extra 4: FALLBACK. Se abbiamo una lettura abbastanza recente, usiamo quella.
        const cached = lastKnown.get(id);
        if (cached && Date.now() - cached.at <= fallbackMaxAgeMs) {
          log?.warn({ productId: id, ageMs: Date.now() - cached.at }, "catalog non disponibile: uso l'ultimo prodotto noto");
          return { ...cached.product, stale: true };
        }
        throw err;
      }
      if (res.status === 404) return undefined;
      if (!res.ok) throw new CatalogUnavailableError(`catalog ha risposto ${res.status}`, "server_error");
      const product = (await res.json()) as CatalogProduct;
      lastKnown.set(id, { product, at: Date.now() });
      return product;
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

    circuitStats() {
      const { fires, failures, timeouts, rejects, successes } = breaker.stats;
      return { fires, failures, timeouts, rejects, successes };
    },

    circuitState() {
      return breaker.opened ? "open" : breaker.halfOpen ? "half-open" : "closed";
    },
  };
}

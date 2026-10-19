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
      throw err;
    }
  }

  // Si riprova solo quando ha senso: errori di catalog, ma non a circuito aperto.
  const retryable = (err: unknown) => err instanceof CatalogUnavailableError && err.kind !== "circuit_open";

  return {
    async getProduct(id, ctx) {
      // GET è idempotente: ripeterla non fa danni, quindi si può riprovare.
      const res = await withRetry(() => guarded(`/products/${encodeURIComponent(id)}`, { method: "GET" }, ctx), {
        retries,
        baseMs: retryBaseMs,
        shouldRetry: retryable,
        onRetry: (err, attempt, delayMs) =>
          log?.warn({ productId: id, attempt, delayMs, reason: (err as Error).message }, "nuovo tentativo verso catalog"),
      });
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
      return breaker.opened ? "open" : breaker.halfOpen ? "half-open" : "closed";
    },
  };
}

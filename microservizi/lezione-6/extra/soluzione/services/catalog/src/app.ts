import { randomUUID } from "node:crypto";
import Fastify, { type FastifyInstance } from "fastify";
import { productRoutes } from "./routes.js";
import { createMemoryStore, type ProductStore } from "./store/index.js";
import { registerChaos, type ChaosOptions } from "./chaos.js";
import { createMemoryCache, type Cache } from "./cache.js";
import { createProductCache } from "./product-cache.js";
import type { ProductEvents } from "./notifier.js";

// buildApp crea l'applicazione senza metterla in ascolto su una porta.
// L'archivio arriva da fuori: i test passano quello in memoria,
// server.ts sceglie in base a DATABASE_URL.
export function buildApp(
  options: {
    logger?: boolean | { level: string };
    store?: ProductStore;
    chaos?: ChaosOptions;
    cache?: Cache;
    cacheTtlSeconds?: number;
    // Lezione 6: per quanto il gateway e i browser possono tenere una risposta
    httpMaxAgeSeconds?: number;
    // Extra 1
    staleWhileRevalidateSeconds?: number;
    // Extra 4: cache locale (L1) davanti a Redis, in millisecondi (0 = spenta)
    localTtlMs?: number;
    // Lezione 6: chi avvisare quando un prodotto cambia
    events?: ProductEvents;
  } = {},
): FastifyInstance {
  const app = Fastify({
    logger: options.logger ?? false,
    // Correlation ID: lo stesso x-request-id che orders (e prima il gateway) ci passa.
    requestIdHeader: "x-request-id",
    genReqId: () => randomUUID(),
  });
  const store = options.store ?? createMemoryStore();
  // Senza una cache esplicita (nei test) usiamo quella in memoria del processo.
  const cache = options.cache ?? createMemoryCache();
  const productCache = createProductCache(cache, {
    ttlSeconds: options.cacheTtlSeconds ?? 60,
    events: options.events,
    localTtlMs: options.localTtlMs ?? 0,
    log: app.log,
  });

  // Quando l'app si chiude (app.close()), chiudiamo anche le connessioni al database.
  app.addHook("onClose", async () => {
    await store.close();
    await cache.close();
    await options.events?.close();
  });
  app.addHook("onSend", async (request, reply) => {
    reply.header("x-request-id", request.id);
  });

  if (options.chaos) registerChaos(app, options.chaos);

  // LIVENESS: il processo è vivo. Non controlla il database: se PostgreSQL è giù,
  // riavviare catalog non serve a niente.
  app.get("/health/live", async () => ({ status: "ok", service: "catalog" }));
  app.get("/health", async () => ({ status: "ok", service: "catalog" }));

  // READINESS: catalog può servire richieste? Senza database no: 503.
  // Un load balancer smette di mandargli traffico finché non torna pronto.
  app.get("/health/ready", async (request, reply) => {
    try {
      await store.ping();
      // La cache NON decide se catalog è pronto: senza Redis si va al database, più lenti ma funzionanti.
      const cacheStatus = await cache.ping().then(() => "ok", () => "down");
      return { status: "ok", service: "catalog", dependencies: { database: "ok", cache: cacheStatus } };
    } catch (err) {
      request.log.warn({ err: (err as Error).message }, "database non raggiungibile");
      return reply.code(503).send({ status: "unavailable", service: "catalog", dependencies: { database: "down" } });
    }
  });

  // Statistiche della cache: quante letture sono state servite senza toccare il database.
  app.get("/cache/stats", async () => productCache.stats());
  // Extra 4: server.ts usa productCache per l'iscrizione al canale.
  app.decorate("productCache", productCache);

  app.register(productRoutes, { store, productCache, httpMaxAgeSeconds: options.httpMaxAgeSeconds ?? 10,
    staleWhileRevalidateSeconds: options.staleWhileRevalidateSeconds ?? 0,
  });

  return app;
}

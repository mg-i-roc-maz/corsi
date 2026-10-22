import { buildApp } from "./app.js";
import { createStoreFromEnv, withSlowReads } from "./store/index.js";
import { createMemoryCache, createRedisCache } from "./cache.js";
import { chaosFromEnv } from "./chaos.js";
import { createRedisNotifier, subscribeToProductChanges } from "./notifier.js";
import type { ProductCache } from "./product-cache.js";

// Tutta la configurazione arriva da variabili d'ambiente:
// la stessa immagine Docker funziona sul tuo PC, in test e in produzione.
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

// DB_DELAY_MS simula un database lento (solo letture), per vedere l'effetto della cache.
const dbDelayMs = Number(process.env.DB_DELAY_MS ?? 0) || 0;
const store = withSlowReads(createStoreFromEnv(), dbDelayMs);

// Con REDIS_URL la cache è Redis, condivisa; senza, una cache in memoria del processo.
// La cache scrive nel log dell'app: lo "agganciamo" dopo che l'app è stata creata.
const log = { warn: (obj: object, msg: string) => app.log.warn(obj, msg) };
const cache = process.env.REDIS_URL ? createRedisCache({ url: process.env.REDIS_URL, log }) : createMemoryCache();
const cacheTtlSeconds = Number(process.env.CACHE_TTL_SECONDS ?? 60) || 60;
// Lezione 6: per quanti secondi gateway e browser possono tenere una risposta (Cache-Control).
const httpMaxAgeSeconds = Number(process.env.HTTP_MAX_AGE_SECONDS ?? 10);
// Lezione 6: con Redis, catalog annuncia ogni modifica sul canale catalog.products.
const events = process.env.REDIS_URL ? createRedisNotifier({ url: process.env.REDIS_URL, log }) : undefined;
// Extra 1 e 4
const staleWhileRevalidateSeconds = Number(process.env.HTTP_SWR_SECONDS ?? 0) || 0;
const localTtlMs = Number(process.env.CACHE_LOCAL_TTL_MS ?? 0) || 0;

// LOG_LEVEL: debug, info, warn, error. In produzione di solito info.
const app = buildApp({
  logger: { level: process.env.LOG_LEVEL ?? "info" },
  store,
  chaos: chaosFromEnv(),
  cache,
  cacheTtlSeconds,
  httpMaxAgeSeconds,
  events,
  staleWhileRevalidateSeconds,
  localTtlMs,
});

// Extra 4: con la cache locale accesa, ascoltiamo gli avvisi delle altre copie di catalog.
const subscription =
  process.env.REDIS_URL && localTtlMs > 0
    ? subscribeToProductChanges({
        url: process.env.REDIS_URL,
        onProductChanged: (id) => (app as unknown as { productCache: ProductCache }).productCache.dropLocal(id),
        log,
      })
    : undefined;

// docker stop manda SIGTERM al processo: chiudiamo il server in modo pulito
// (finiamo le richieste in corso, chiudiamo il database) invece di essere uccisi.
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, async () => {
    app.log.info(`${signal} ricevuto, chiudo il server`);
    await app.close();
    await subscription?.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port, host });
  app.log.info(`Archivio prodotti: ${process.env.DATABASE_URL ? "PostgreSQL" : "memoria"}`);
  app.log.info({ cache: process.env.REDIS_URL ? "redis" : "memoria", cacheTtlSeconds, httpMaxAgeSeconds, staleWhileRevalidateSeconds, localTtlMs, dbDelayMs }, "cache");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

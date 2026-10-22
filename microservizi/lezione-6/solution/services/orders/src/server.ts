import { buildApp } from "./app.js";
import { createHttpCatalogClient } from "./catalog-client.js";
import { loadConfig } from "./config.js";
import { withLocalCache, type CachedCatalogClient } from "./local-cache.js";
import { concernsOrders, subscribeToProductChanges } from "./invalidation.js";

// La configurazione si legge e si controlla PRIMA di fare qualsiasi altra cosa.
let config;
try {
  config = loadConfig();
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}

// Lezione 6: il client di catalog con davanti la cache locale dei prodotti.
let catalog: CachedCatalogClient | undefined;

const app = buildApp({
  logger: { level: config.logLevel },
  retryAfterSeconds: Math.ceil(config.breaker.resetTimeoutMs / 1000),
  // Il client di catalog scrive i suoi eventi (retry, circuito) nello stesso log dell'app.
  catalog: (log) => {
    const http = createHttpCatalogClient({
      baseUrl: config.catalog.url,
      timeoutMs: config.catalog.timeoutMs,
      retries: config.catalog.retries,
      retryBaseMs: config.catalog.retryBaseMs,
      breaker: config.breaker,
      log,
    });
    catalog = withLocalCache(http, { ttlMs: config.catalog.cacheTtlMs });
    return catalog;
  },
});

// Lezione 6: INVALIDAZIONE TRA SERVIZI. Quando catalog annuncia che un prodotto
// è cambiato, buttiamo la nostra copia: il prossimo ordine rilegge il prezzo.
const subscription = config.redisUrl
  ? subscribeToProductChanges({
      url: config.redisUrl,
      onProductChanged: (event) => {
        if (!concernsOrders(event)) return;
        catalog?.invalidate(event.productId);
        app.log.info(event, "prodotto cambiato in catalog: copia locale buttata");
      },
      log: app.log,
    })
  : undefined;

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, async () => {
    app.log.info(`${signal} ricevuto, chiudo il server`);
    await app.close();
    await subscription?.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port: config.port, host: config.host });
  app.log.info({ catalog: config.catalog, breaker: config.breaker, redis: Boolean(config.redisUrl) }, "configurazione");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

import { buildApp } from "./app.js";
import { createHttpCatalogClient } from "./catalog-client.js";
import { loadConfig } from "./config.js";

// La configurazione si legge e si controlla PRIMA di fare qualsiasi altra cosa.
let config;
try {
  config = loadConfig();
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}

const app = buildApp({
  logger: { level: config.logLevel },
  retryAfterSeconds: Math.ceil(config.breaker.resetTimeoutMs / 1000),
  // Il client di catalog scrive i suoi eventi (retry, circuito) nello stesso log dell'app.
  catalog: (log) =>
    createHttpCatalogClient({
      baseUrl: config.catalog.url,
      timeoutMs: config.catalog.timeoutMs,
      retries: config.catalog.retries,
      retryBaseMs: config.catalog.retryBaseMs,
      breaker: config.breaker,
      log,
    }),
});

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, async () => {
    app.log.info(`${signal} ricevuto, chiudo il server`);
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port: config.port, host: config.host });
  app.log.info({ catalog: config.catalog, breaker: config.breaker }, "configurazione");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

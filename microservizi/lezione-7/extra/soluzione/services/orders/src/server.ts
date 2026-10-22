import { buildApp } from "./app.js";
import { createHttpCatalogClient } from "./catalog-client.js";
import { loadConfig } from "./config.js";
import { withLocalCache, type CachedCatalogClient } from "./local-cache.js";
import { concernsOrders, subscribeToProductChanges } from "./invalidation.js";
import { createRabbitPublisher } from "./events.js";
import { withRetryBuffer } from "./retry-buffer.js";
import { consumeProductChanges } from "./product-events.js";

// La configurazione si legge e si controlla PRIMA di fare qualsiasi altra cosa.
let config;
try {
  config = loadConfig();
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}

// Lezione 7: gli eventi vanno su RabbitMQ. Il logger dell'app non esiste ancora:
// lo "agganciamo" dopo, come per la cache di catalog.
const log = { info: (o: object, m: string) => app.log.info(o, m), warn: (o: object, m: string) => app.log.warn(o, m) };
// Extra 4: davanti al publisher, un buffer che riprova gli eventi non partiti.
const events = config.rabbitmqUrl
  ? withRetryBuffer(await createRabbitPublisher({ url: config.rabbitmqUrl, log }), { log })
  : undefined;

// Lezione 6: il client di catalog con davanti la cache locale dei prodotti.
let catalog: CachedCatalogClient | undefined;

const app = buildApp({
  logger: { level: config.logLevel },
  retryAfterSeconds: Math.ceil(config.breaker.resetTimeoutMs / 1000),
  events,
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
// Extra 2: con RabbitMQ gli avvisi arrivano da una coda di orders; senza, da Redis Pub/Sub.
const onProductChanged = (event: { productId: string; change: "updated" | "deleted" | "stock" }) => {
  if (!concernsOrders(event)) return;
  catalog?.invalidate(event.productId);
  app.log.info(event, "prodotto cambiato in catalog: copia locale buttata");
};
const subscription = config.rabbitmqUrl
  ? await consumeProductChanges({ url: config.rabbitmqUrl, onProductChanged, log: app.log })
  : config.redisUrl
    ? subscribeToProductChanges({ url: config.redisUrl, onProductChanged, log: app.log })
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
  app.log.info({ catalog: config.catalog, breaker: config.breaker, redis: Boolean(config.redisUrl), rabbitmq: Boolean(config.rabbitmqUrl) }, "configurazione");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

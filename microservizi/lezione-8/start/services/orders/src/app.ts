import { randomUUID } from "node:crypto";
import Fastify, { type FastifyBaseLogger, type FastifyInstance } from "fastify";
import { orderRoutes } from "./routes.js";
import { createOrderStore, type OrderStore } from "./store.js";
import { createHttpCatalogClient, type CatalogClient } from "./catalog-client.js";
import type { OrderEvents } from "./events.js";

export interface AppOptions {
  logger?: boolean | { level: string };
  store?: OrderStore;
  // Un client già pronto (nei test) oppure una funzione che lo crea con il logger dell'app.
  catalog?: CatalogClient | ((log: FastifyBaseLogger) => CatalogClient);
  retryAfterSeconds?: number;
  // Lezione 7: dove pubblicare gli eventi (RabbitMQ, o in memoria nei test).
  // Lezione 8: lo usa il relay dell'outbox; qui serve per lo stato di salute.
  events?: OrderEvents;
}

export function buildApp(options: AppOptions = {}): FastifyInstance {
  const app = Fastify({
    logger: options.logger ?? false,
    // CORRELATION ID: se la richiesta arriva con x-request-id (lo mette il gateway)
    // usiamo quello, altrimenti ne generiamo uno. Fastify lo scrive in ogni riga di log
    // come "reqId".
    requestIdHeader: "x-request-id",
    genReqId: () => randomUUID(),
  });
  const store = options.store ?? createOrderStore();
  const catalog =
    typeof options.catalog === "function"
      ? options.catalog(app.log)
      : (options.catalog ?? createHttpCatalogClient({ baseUrl: process.env.CATALOG_URL ?? "http://localhost:3001" }));

  // Il correlation ID torna anche al client, nella risposta.
  app.addHook("onSend", async (request, reply) => {
    reply.header("x-request-id", request.id);
  });

  // LIVENESS: il processo è vivo? Se no, va riavviato.
  app.get("/health/live", async () => ({ status: "ok", service: "orders" }));
  app.get("/health", async () => ({ status: "ok", service: "orders" }));

  // READINESS: orders può ricevere traffico? Sì, anche con catalog giù:
  // sa rispondere 503 da solo. Se dicessimo "non pronto" quando catalog è giù,
  // un problema di catalog spegnerebbe anche orders (guasto a cascata).
  // Lo stato del circuito lo mostriamo comunque: è utile a chi guarda.
  app.get("/health/ready", async (request, reply) => {
    const dependencies = {
      catalog: { circuit: catalog.circuitState?.() ?? "unknown" },
      // Con RabbitMQ giù orders funziona: gli eventi aspettano nell'outbox.
      broker: options.events ? (options.events.connected() ? "ok" : "down") : "disabled",
    };
    // Lezione 8: orders ha un SUO database. Senza, non può salvare ordini: non è pronto.
    try {
      await store.ping();
    } catch (err) {
      request.log.warn({ err: (err as Error).message }, "database di orders non raggiungibile");
      return reply.code(503).send({ status: "unavailable", service: "orders", dependencies: { ...dependencies, database: "down" } });
    }
    return { status: "ok", service: "orders", dependencies: { ...dependencies, database: "ok" } };
  });

  // Lezione 8: quanti eventi aspettano nell'outbox, quanti sono già partiti.
  app.get("/outbox/stats", async () => store.outboxStats());

  // Lezione 6: le statistiche della cache locale dei prodotti.
  app.get("/cache/stats", async () => catalog.cacheStats?.() ?? { enabled: false });

  app.addHook("onClose", async () => {
    await options.events?.close();
    await store.close();
  });

  app.register(orderRoutes, { store, catalog, retryAfterSeconds: options.retryAfterSeconds });

  return app;
}

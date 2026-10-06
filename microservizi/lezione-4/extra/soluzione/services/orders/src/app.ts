import { randomUUID } from "node:crypto";
import Fastify, { type FastifyBaseLogger, type FastifyInstance } from "fastify";
import { orderRoutes } from "./routes.js";
import { createOrderStore, type OrderStore } from "./store.js";
import { createHttpCatalogClient, type CatalogClient } from "./catalog-client.js";

export interface AppOptions {
  logger?: boolean | { level: string };
  store?: OrderStore;
  // Un client già pronto (nei test) oppure una funzione che lo crea con il logger dell'app.
  catalog?: CatalogClient | ((log: FastifyBaseLogger) => CatalogClient);
  retryAfterSeconds?: number;
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
  app.get("/health/ready", async () => ({
    status: "ok",
    service: "orders",
    dependencies: { catalog: { circuit: catalog.circuitState?.() ?? "unknown", stats: catalog.circuitStats?.() } },
  }));

  app.register(orderRoutes, { store, catalog, retryAfterSeconds: options.retryAfterSeconds });

  return app;
}

import { randomUUID } from "node:crypto";
import Fastify, { type FastifyInstance } from "fastify";
import { productRoutes } from "./routes.js";
import { createMemoryStore, type ProductStore } from "./store/index.js";
import { registerChaos, type ChaosOptions } from "./chaos.js";

// buildApp crea l'applicazione senza metterla in ascolto su una porta.
// L'archivio arriva da fuori: i test passano quello in memoria,
// server.ts sceglie in base a DATABASE_URL.
export function buildApp(
  options: { logger?: boolean | { level: string }; store?: ProductStore; chaos?: ChaosOptions } = {},
): FastifyInstance {
  const app = Fastify({
    logger: options.logger ?? false,
    // Correlation ID: lo stesso x-request-id che orders (e prima il gateway) ci passa.
    requestIdHeader: "x-request-id",
    genReqId: () => randomUUID(),
  });
  const store = options.store ?? createMemoryStore();

  // Quando l'app si chiude (app.close()), chiudiamo anche le connessioni al database.
  app.addHook("onClose", async () => store.close());
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
      return { status: "ok", service: "catalog", dependencies: { database: "ok" } };
    } catch (err) {
      request.log.warn({ err: (err as Error).message }, "database non raggiungibile");
      return reply.code(503).send({ status: "unavailable", service: "catalog", dependencies: { database: "down" } });
    }
  });

  app.register(productRoutes, { store });

  return app;
}

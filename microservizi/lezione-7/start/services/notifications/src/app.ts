// Il servizio notifications ha poco HTTP: il suo lavoro arriva dalla coda.
// Le rotte servono a vederlo lavorare (e ai controlli di salute).
import { randomUUID } from "node:crypto";
import Fastify, { type FastifyInstance } from "fastify";
import type { HandlerStats } from "./handlers.js";
import type { Mailer } from "./mailer.js";

export interface AppOptions {
  logger?: boolean | { level: string };
  mailer: Mailer;
  stats: () => HandlerStats;
  brokerConnected?: () => boolean;
}

export function buildApp({ logger = false, mailer, stats, brokerConnected = () => false }: AppOptions): FastifyInstance {
  const app = Fastify({ logger, requestIdHeader: "x-request-id", genReqId: () => randomUUID() });

  app.get("/health/live", async () => ({ status: "ok", service: "notifications" }));
  app.get("/health", async () => ({ status: "ok", service: "notifications" }));

  // READINESS: senza RabbitMQ notifications non ha niente da fare, ma non perde niente:
  // i messaggi lo aspettano in coda. Lo diciamo, senza fallire.
  app.get("/health/ready", async () => ({
    status: "ok",
    service: "notifications",
    dependencies: { broker: brokerConnected() ? "ok" : "down" },
  }));

  // Le ultime email "inviate", dalla più recente.
  app.get("/notifications", async () => mailer.sent().reverse());

  // Quanti eventi ricevuti, email inviate, fallimenti, riconsegne.
  app.get("/stats", async () => stats());

  return app;
}

import Fastify, { type FastifyInstance } from "fastify";
import { orderRoutes } from "./routes.js";
import { createOrderStore, type OrderStore } from "./store.js";

export function buildApp(options: { logger?: boolean; store?: OrderStore } = {}): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? false });
  const store = options.store ?? createOrderStore();

  app.get("/health", async () => ({ status: "ok", service: "orders" }));
  app.register(orderRoutes, { store });

  return app;
}

import Fastify, { type FastifyInstance } from "fastify";
import { orderRoutes } from "./routes.js";
import { createOrderStore, type OrderStore } from "./store.js";
import { createHttpCatalogClient, type CatalogClient } from "./catalog-client.js";

// Le dipendenze arrivano da fuori: i test passano un catalog finto,
// server.ts quello vero, che parla HTTP con l'indirizzo di CATALOG_URL.
export function buildApp(
  options: { logger?: boolean; store?: OrderStore; catalog?: CatalogClient } = {},
): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? false });
  const store = options.store ?? createOrderStore();
  const catalog = options.catalog ?? createHttpCatalogClient(process.env.CATALOG_URL ?? "http://localhost:3001");

  app.get("/health", async () => ({ status: "ok", service: "orders" }));
  app.register(orderRoutes, { store, catalog });

  return app;
}

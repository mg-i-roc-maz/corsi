import Fastify, { type FastifyInstance } from "fastify";
import { productRoutes } from "./routes.js";
import * as store from "./store.js";

// buildApp crea l'applicazione senza metterla in ascolto su una porta.
// Così i test possono usare app.inject() senza aprire connessioni di rete.
export function buildApp(options: { logger?: boolean } = {}): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? false });

  store.seed();

  // Health check: risponde se il processo è vivo.
  // Nella lezione 4 lo useremo per capire se un servizio è pronto.
  app.get("/health", async () => ({ status: "ok", service: "catalog" }));

  app.register(productRoutes);

  return app;
}

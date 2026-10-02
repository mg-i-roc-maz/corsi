import Fastify, { type FastifyInstance } from "fastify";
import { productRoutes } from "./routes.js";
import { createMemoryStore, type ProductStore } from "./store/index.js";

// buildApp crea l'applicazione senza metterla in ascolto su una porta.
// L'archivio arriva da fuori: i test passano quello in memoria,
// server.ts sceglie in base a DATABASE_URL.
export function buildApp(options: { logger?: boolean; store?: ProductStore } = {}): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? false });
  const store = options.store ?? createMemoryStore();

  // Quando l'app si chiude (app.close()), chiudiamo anche le connessioni al database.
  app.addHook("onClose", async () => store.close());

  // Health check: risponde se il processo è vivo.
  app.get("/health", async () => ({ status: "ok", service: "catalog" }));

  app.register(productRoutes, { store });

  return app;
}

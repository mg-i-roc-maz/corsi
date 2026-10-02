import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
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

  // Rotte inesistenti: stesso formato di errore del resto dell'API
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: `Rotta ${request.method} ${request.url} inesistente` });
  });

  // Errori di validazione e imprevisti: formato uniforme { error, details? }
  app.setErrorHandler<FastifyError>((error, request, reply) => {
    if (error.validation) {
      return reply.code(400).send({
        error: "Dati non validi",
        details: error.validation.map((v) => `${v.instancePath || "body"} ${v.message}`),
      });
    }
    request.log.error(error);
    return reply.code(500).send({ error: "Errore interno" });
  });

  return app;
}

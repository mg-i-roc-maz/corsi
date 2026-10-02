import Fastify from "fastify";
import { seed } from "./db.js";
import { catalogRoutes } from "./catalog/routes.js";
import { orderRoutes } from "./orders/routes.js";

// Il monolite: un processo, una porta, un database, due moduli.

const port = Number(process.env.PORT ?? 3000);
const app = Fastify({ logger: true });

seed();
app.get("/health", async () => ({ status: "ok", service: "monolith" }));
app.register(catalogRoutes);
app.register(orderRoutes);

try {
  await app.listen({ port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

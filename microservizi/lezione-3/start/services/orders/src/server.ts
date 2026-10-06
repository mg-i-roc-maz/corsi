import { buildApp } from "./app.js";
import { createHttpCatalogClient } from "./catalog-client.js";

// Tutta la configurazione arriva da variabili d'ambiente:
// la stessa immagine Docker funziona sul tuo PC, in test e in produzione.
const port = Number(process.env.PORT ?? 3002);
const host = process.env.HOST ?? "0.0.0.0";

// Service discovery con il DNS di Compose: dentro la rete "catalog" è un nome valido.
// Fuori da Docker (npm run dev) catalog è su localhost.
const catalogUrl = process.env.CATALOG_URL ?? "http://localhost:3001";

const app = buildApp({ logger: true, catalog: createHttpCatalogClient(catalogUrl) });

// docker stop manda SIGTERM al processo: chiudiamo il server in modo pulito
// (finiamo le richieste in corso) invece di essere uccisi.
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, async () => {
    app.log.info(`${signal} ricevuto, chiudo il server`);
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port, host });
  app.log.info(`catalog atteso su ${catalogUrl}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

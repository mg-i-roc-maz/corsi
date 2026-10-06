import { buildApp } from "./app.js";
import { createStoreFromEnv } from "./store/index.js";
import { chaosFromEnv } from "./chaos.js";

// Tutta la configurazione arriva da variabili d'ambiente:
// la stessa immagine Docker funziona sul tuo PC, in test e in produzione.
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

const store = createStoreFromEnv();
// LOG_LEVEL: debug, info, warn, error. In produzione di solito info.
const app = buildApp({ logger: { level: process.env.LOG_LEVEL ?? "info" }, store, chaos: chaosFromEnv() });

// docker stop manda SIGTERM al processo: chiudiamo il server in modo pulito
// (finiamo le richieste in corso, chiudiamo il database) invece di essere uccisi.
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, async () => {
    app.log.info(`${signal} ricevuto, chiudo il server`);
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port, host });
  app.log.info(`Archivio prodotti: ${process.env.DATABASE_URL ? "PostgreSQL" : "memoria"}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

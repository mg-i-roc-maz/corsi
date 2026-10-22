import { buildApp } from "./app.js";
import { startConsumer } from "./broker.js";
import { createHandler } from "./handlers.js";
import { createLogMailer } from "./mailer.js";

const port = Number(process.env.PORT ?? 3003);
const host = process.env.HOST ?? "0.0.0.0";
const rabbitmqUrl = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";
// Simula un server di posta inaffidabile: percentuale di email che falliscono.
const failPercent = Number(process.env.MAIL_FAIL_PERCENT ?? 0) || 0;
// Simula un'email lenta da mandare (millisecondi): utile per vedere i messaggi "unacked".
const sendDelayMs = Number(process.env.MAIL_DELAY_MS ?? 0) || 0;
const prefetch = Number(process.env.PREFETCH ?? 10) || 10;

const mailer = createLogMailer({ failPercent, delayMs: sendDelayMs });
let consumer: Awaited<ReturnType<typeof startConsumer>> | undefined;

const app = buildApp({
  logger: { level: process.env.LOG_LEVEL ?? "info" },
  mailer,
  stats: () => handler.stats(),
  brokerConnected: () => consumer?.connected() ?? false,
});

// Prima l'app (e il suo logger), poi il collegamento alla coda.
const handler = createHandler(mailer, app.log);
mailer.log = app.log;
consumer = await startConsumer({ url: rabbitmqUrl, handler, prefetch, log: app.log });

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, async () => {
    app.log.info(`${signal} ricevuto, chiudo`);
    // Prima smettiamo di ricevere: i messaggi non confermati tornano in coda.
    await consumer?.close();
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port, host });
  app.log.info({ failPercent, sendDelayMs, prefetch }, "configurazione");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

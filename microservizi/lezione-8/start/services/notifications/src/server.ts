import { buildApp } from "./app.js";
import { startConsumer } from "./broker.js";
import { createHandler } from "./handlers.js";
import { createLogMailer } from "./mailer.js";
import { createRedisSeenStore } from "./seen.js";
import type { Outcome } from "./consume.js";

const port = Number(process.env.PORT ?? 3003);
const host = process.env.HOST ?? "0.0.0.0";
const rabbitmqUrl = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";
// Simula un server di posta inaffidabile: percentuale di email che falliscono.
const failPercent = Number(process.env.MAIL_FAIL_PERCENT ?? 0) || 0;
// Simula un'email lenta da mandare (millisecondi): utile per vedere i messaggi "unacked".
const sendDelayMs = Number(process.env.MAIL_DELAY_MS ?? 0) || 0;
const prefetch = Number(process.env.PREFETCH ?? 10) || 10;
// Lezione 8: quanti tentativi in tutto, e quanto aspettare tra uno e l'altro.
const maxAttempts = Number(process.env.MAX_ATTEMPTS ?? 3) || 3;
const retryDelayMs = Number(process.env.RETRY_DELAY_MS ?? 5000) || 5000;
// Lezione 8: dove ricordare gli eventi già gestiti (consumer idempotente).
const redisUrl = process.env.REDIS_URL;

const mailer = createLogMailer({ failPercent, delayMs: sendDelayMs });
let consumer: Awaited<ReturnType<typeof startConsumer>> | undefined;
// Come è finito ogni messaggio: confermato, riprovato più tardi, nella DLQ.
const outcomes: Record<Outcome, number> = { acked: 0, retried: 0, "dead-lettered": 0 };

const app = buildApp({
  logger: { level: process.env.LOG_LEVEL ?? "info" },
  mailer,
  stats: () => ({ ...handler.stats(), ...outcomes }),
  brokerConnected: () => consumer?.connected() ?? false,
});

// Prima l'app (e il suo logger), poi il collegamento alla coda.
const seen = redisUrl ? createRedisSeenStore({ url: redisUrl, log: app.log }) : undefined;
const handler = createHandler(mailer, { seen, log: app.log });
mailer.log = app.log;
consumer = await startConsumer({
  url: rabbitmqUrl,
  handler,
  prefetch,
  maxAttempts,
  retryDelayMs,
  onOutcome: (outcome) => outcomes[outcome]++,
  log: app.log,
});

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, async () => {
    app.log.info(`${signal} ricevuto, chiudo`);
    // Prima smettiamo di ricevere: i messaggi non confermati tornano in coda.
    await consumer?.close();
    await seen?.close();
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port, host });
  app.log.info({ failPercent, sendDelayMs, prefetch, maxAttempts, retryDelayMs, idempotent: Boolean(redisUrl) }, "configurazione");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

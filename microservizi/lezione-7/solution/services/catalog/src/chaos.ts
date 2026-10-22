// "Chaos" controllato, per gli esperimenti della lezione 4.
// Con due variabili d'ambiente catalog diventa lento o inaffidabile:
//   CHAOS_DELAY_MS=3000      ogni richiesta sui prodotti aspetta 3 secondi
//   CHAOS_FAIL_PERCENT=50    metà delle richieste sui prodotti risponde 503
// Non tocca /health: vogliamo un servizio vivo ma malato, il caso più difficile.
import type { FastifyInstance } from "fastify";

export interface ChaosOptions {
  delayMs: number;
  failPercent: number;
  random?: () => number;
}

export function chaosFromEnv(env: NodeJS.ProcessEnv = process.env): ChaosOptions {
  return {
    delayMs: Number(env.CHAOS_DELAY_MS ?? 0) || 0,
    failPercent: Number(env.CHAOS_FAIL_PERCENT ?? 0) || 0,
  };
}

export function registerChaos(app: FastifyInstance, chaos: ChaosOptions): void {
  if (!chaos.delayMs && !chaos.failPercent) return;
  const random = chaos.random ?? Math.random;
  app.log.warn({ chaos }, "CHAOS attivo: catalog risponde lento o con errori");
  app.addHook("onRequest", async (request, reply) => {
    if (!request.url.startsWith("/products")) return;
    if (chaos.delayMs) await new Promise((r) => setTimeout(r, chaos.delayMs));
    if (random() * 100 < chaos.failPercent) {
      return reply.code(503).send({ error: "Errore simulato (CHAOS_FAIL_PERCENT)" });
    }
  });
}

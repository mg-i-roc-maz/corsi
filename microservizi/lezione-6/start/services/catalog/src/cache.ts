// La cache: un posto veloce dove tenere copie dei dati, con una scadenza (TTL).
// Due implementazioni con la stessa interfaccia:
//   - Redis: condivisa da tutte le copie di catalog, sopravvive ai loro riavvii
//   - memoria: dentro il processo, per i test e per "npm run dev" senza Redis
import { createClient } from "redis";

export interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(...keys: string[]): Promise<void>;
  ping(): Promise<void>;
  close(): Promise<void>;
}

// ---------------------------------------------------------------- Redis

export interface RedisCacheOptions {
  url: string;
  timeoutMs?: number; // la cache deve essere VELOCE: oltre questo tempo, meglio andare al database
  log?: { warn: (obj: object, msg: string) => void };
}

export function createRedisCache({ url, timeoutMs = 200, log }: RedisCacheOptions): Cache {
  const client = createClient({
    url,
    // Se Redis è giù, i comandi falliscono SUBITO invece di restare in coda
    // aspettando la riconnessione (lezione 4: lento è peggio di spento).
    disableOfflineQueue: true,
    socket: {
      connectTimeout: 2000,
      // Riprova a collegarsi ogni volta un po' più tardi, fino a 2 secondi.
      reconnectStrategy: (retries) => Math.min(100 * 2 ** retries, 2000),
    },
  });

  // Senza un gestore di "error", node-redis farebbe terminare il processo.
  let lastWarn = 0;
  client.on("error", (err: Error) => {
    if (Date.now() - lastWarn > 5000) {
      lastWarn = Date.now();
      log?.warn({ err: err.message }, "Redis non disponibile: catalog continua senza cache");
    }
  });
  // Non aspettiamo la connessione: catalog parte anche se Redis non c'è ancora.
  client.connect().catch(() => {});

  // Ogni comando ha un tempo massimo.
  function withTimeout<T>(op: Promise<T>): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Redis non ha risposto entro ${timeoutMs} ms`)), timeoutMs);
    });
    return Promise.race([op, timeout]).finally(() => clearTimeout(timer));
  }

  return {
    async get(key) {
      return withTimeout(client.get(key));
    },
    async set(key, value, ttlSeconds) {
      // EX = scadenza in secondi: dopo, Redis cancella la chiave da solo.
      await withTimeout(client.set(key, value, { EX: ttlSeconds }));
    },
    async del(...keys) {
      if (keys.length) await withTimeout(client.del(keys));
    },
    async ping() {
      await withTimeout(client.ping());
    },
    async close() {
      if (client.isOpen) await client.close();
    },
  };
}

// ---------------------------------------------------------------- Memoria

export function createMemoryCache(now: () => number = Date.now): Cache {
  const entries = new Map<string, { value: string; expiresAt: number }>();
  return {
    async get(key) {
      const entry = entries.get(key);
      if (!entry) return null;
      if (entry.expiresAt <= now()) {
        entries.delete(key);
        return null;
      }
      return entry.value;
    },
    async set(key, value, ttlSeconds) {
      entries.set(key, { value, expiresAt: now() + ttlSeconds * 1000 });
    },
    async del(...keys) {
      for (const key of keys) entries.delete(key);
    },
    async ping() {},
    async close() {},
  };
}

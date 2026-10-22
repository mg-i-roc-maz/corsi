// CONSUMER IDEMPOTENTE: ricordare quali eventi abbiamo già gestito.
//
// Con at-least-once lo stesso evento può arrivare due volte (lezione 7). Ogni evento
// ha un id unico: prima di mandare l'email lo "prenotiamo" in Redis con SET NX
// (scrive solo se la chiave NON esiste). Se la chiave c'era già, è un doppione.
//
//   claim(id)    true = è la prima volta, procedi;  false = già visto, salta
//   release(id)  l'email non è partita: liberiamo l'id, il prossimo tentativo potrà rifarla
//
// Gli id si tengono per un tempo limitato (TTL): un doppione arriva entro minuti, non mesi.
import { createClient } from "redis";

export interface SeenStore {
  claim(eventId: string): Promise<boolean>;
  release(eventId: string): Promise<void>;
}

export const seenKey = (eventId: string) => `notifications:seen:${eventId}`;

export function createRedisSeenStore({
  url,
  ttlSeconds = 7 * 24 * 3600,
  log,
}: {
  url: string;
  ttlSeconds?: number;
  log?: { warn: (obj: object, msg: string) => void };
}): SeenStore & { close(): Promise<void> } {
  const client = createClient({
    url,
    disableOfflineQueue: true,
    socket: { connectTimeout: 2000, reconnectStrategy: (retries) => Math.min(100 * 2 ** retries, 2000) },
  });
  let lastWarn = 0;
  client.on("error", (err: Error) => {
    if (Date.now() - lastWarn > 5000) {
      lastWarn = Date.now();
      log?.warn({ err: err.message }, "Redis non disponibile: niente controllo dei doppioni");
    }
  });
  client.connect().catch(() => {});

  return {
    async claim(eventId) {
      // NX: solo se non esiste.  EX: scade da sola dopo ttlSeconds.
      const result = await client.set(seenKey(eventId), new Date().toISOString(), { NX: true, EX: ttlSeconds });
      return result === "OK";
    },
    async release(eventId) {
      await client.del(seenKey(eventId));
    },
    async close() {
      if (client.isOpen) await client.close();
    },
  };
}

// Per i test (e senza Redis): un Set in memoria.
export function createMemorySeenStore(): SeenStore & { ids: Set<string> } {
  const ids = new Set<string>();
  return {
    ids,
    async claim(eventId) {
      if (ids.has(eventId)) return false;
      ids.add(eventId);
      return true;
    },
    async release(eventId) {
      ids.delete(eventId);
    },
  };
}

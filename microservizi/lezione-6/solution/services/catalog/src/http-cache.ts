// CACHE HTTP: catalog dice a chi sta davanti (gateway, browser) se e per quanto
// può tenere una copia della risposta, e come controllare se è ancora buona.
//
//   Cache-Control: public, max-age=10   "puoi tenerla 10 secondi, anche in una cache condivisa"
//   ETag: "abc..."                       l'impronta del contenuto: cambia se il contenuto cambia
//
// Dopo i 10 secondi chi ha la copia chiede:  If-None-Match: "abc..."
// Se l'impronta è la stessa, catalog risponde 304 Not Modified, SENZA corpo:
// la copia vecchia va ancora bene, e in rete viaggiano pochi byte.
import { createHash } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

// L'impronta del contenuto: un hash del JSON. Stesso contenuto, stessa ETag.
// Le virgolette fanno parte della ETag (lo dice lo standard HTTP).
export function etagOf(body: unknown): string {
  const hash = createHash("sha1").update(JSON.stringify(body)).digest("base64url");
  return `"${hash}"`;
}

// If-None-Match può contenere più ETag separate da virgole, o *.
// Una ETag "debole" (W/"...") va bene lo stesso per un GET.
export function matches(ifNoneMatch: string | undefined, etag: string): boolean {
  if (!ifNoneMatch) return false;
  return ifNoneMatch
    .split(",")
    .map((tag) => tag.trim().replace(/^W\//, ""))
    .some((tag) => tag === etag || tag === "*");
}

// Risponde con un corpo che si può tenere in cache per maxAgeSeconds.
export function sendCacheable(request: FastifyRequest, reply: FastifyReply, body: unknown, maxAgeSeconds: number) {
  const etag = etagOf(body);
  reply.header("Cache-Control", `public, max-age=${maxAgeSeconds}`);
  reply.header("ETag", etag);
  if (matches(request.headers["if-none-match"], etag)) {
    // La copia del client è ancora buona: niente corpo.
    return reply.code(304).send();
  }
  return reply.send(body);
}

// Le risposte che NON vanno tenute da nessuno: errori, risultati di una scrittura.
export function noStore(reply: FastifyReply) {
  return reply.header("Cache-Control", "no-store");
}

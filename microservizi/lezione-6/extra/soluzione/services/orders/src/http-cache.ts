// Extra 3: cache HTTP PRIVATA per gli ordini.
//
//   Cache-Control: private, no-cache
//     private   solo il browser del cliente può tenerla, MAI una cache condivisa (gateway, CDN):
//               l'ordine di Anna non deve finire nella risposta di Bruno
//     no-cache  la copia si può tenere, ma va ricontrollata ogni volta (If-None-Match)
//   ETag        l'impronta: se l'ordine non è cambiato, 304 senza corpo
import { createHash } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

export function etagOf(body: unknown): string {
  return `"${createHash("sha1").update(JSON.stringify(body)).digest("base64url")}"`;
}

export function sendPrivate(request: FastifyRequest, reply: FastifyReply, body: unknown) {
  const etag = etagOf(body);
  reply.header("Cache-Control", "private, no-cache");
  reply.header("ETag", etag);
  const ifNoneMatch = request.headers["if-none-match"];
  const matches = ifNoneMatch?.split(",").some((tag) => tag.trim().replace(/^W\//, "") === etag);
  if (matches) return reply.code(304).send();
  return reply.send(body);
}

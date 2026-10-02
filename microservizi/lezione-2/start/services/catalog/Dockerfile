# Parte 2 · Immagine del servizio catalog, in due fasi (multi-stage build).
# Completa i TODO. Il risultato si avvia con:
#   docker build -t shop-catalog ./services/catalog
#   docker run --rm -p 3001:3001 shop-catalog

# ---- Fase 1: build ----------------------------------------------------------
FROM node:22-slim AS build
WORKDIR /app

# TODO 1: copia SOLO package.json e package-lock.json, poi installa le dipendenze con npm ci.
#         Perché prima solo questi due file? Pensa alla cache dei layer.

# TODO 2: copia tsconfig.json, tsconfig.build.json e la cartella src,
#         poi compila con npm run build (crea la cartella dist).

# ---- Fase 2: runtime --------------------------------------------------------
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app

# TODO 3: copia di nuovo i file delle dipendenze e installa SOLO quelle di produzione
#         (npm ci --omit=dev).

# TODO 4: copia la cartella dist dalla fase "build" (COPY --from=build ...).

# TODO 5: esegui come utente "node" (non root), dichiara la porta 3001
#         e avvia con: node dist/server.js  (forma JSON: CMD ["...", "..."])

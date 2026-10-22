# Immagine del servizio orders, costruita in due fasi (multi-stage build).

# ---- Fase 1: build ----------------------------------------------------------
# Qui servono TypeScript e tutte le dipendenze di sviluppo.
FROM node:22-slim AS build
WORKDIR /app

# Prima solo i file delle dipendenze: finché non cambiano,
# Docker riusa dalla cache il layer di "npm ci" e la build è velocissima.
COPY package.json package-lock.json ./
RUN npm ci

# Poi il codice, che cambia spesso.
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# ---- Fase 2: runtime --------------------------------------------------------
# Riparte da un'immagine pulita: niente TypeScript, niente sorgenti.
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Dalla fase di build prendiamo solo il JavaScript compilato.
COPY --from=build /app/dist ./dist

# Non eseguire il servizio come root: l'utente "node" esiste già nell'immagine.
USER node
EXPOSE 3002
CMD ["node", "dist/server.js"]

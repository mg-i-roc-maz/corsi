# Lezione 2 · Esercizi extra

Per chi finisce prima o vuole approfondire a casa. Si parte dalla propria cartella `lezione-2/start` completata. Le soluzioni sono in [`soluzione/`](soluzione/).

## 1. Un'immagine più piccola

Crea `services/catalog/Dockerfile.alpine` usando `node:22-alpine` al posto di `node:22-slim` e costruiscila con il tag `shop-catalog:alpine`.

```bash
docker build -f services/catalog/Dockerfile.alpine -t shop-catalog:alpine ./services/catalog
docker images shop-catalog
```

- Di quanto è più piccola?
- Prova anche una versione *senza* multi-stage (una sola fase con `npm ci` completo): quanto pesa?
- Alpine usa `musl` invece di `glibc`: in quali casi potrebbe dare problemi?

## 2. Healthcheck anche per catalog

Aggiungi un `healthcheck` al servizio `catalog` che chiami `/health`. Attenzione: nell'immagine `node:22-slim` non c'è `curl`, ma c'è `node`, che ha `fetch`.

Poi fai partire `orders` solo quando `catalog` è `healthy`. Verifica con `docker compose ps`.

## 3. Guardare il database con Adminer

Aggiungi a `compose.yaml` un servizio `adminer` (immagine `adminer`, porta `8080`). Apri http://localhost:8080 e collegati al database `catalog`.

- Che nome di server devi usare? Perché non `localhost`?
- Modifica un prezzo da Adminer, poi rileggi il prodotto con `http/catalog.http`.

## 4. La password fuori da compose.yaml

1. Copia `.env.example` in `.env` e cambia la password.
2. In `compose.yaml` togli il valore di riserva: `${POSTGRES_PASSWORD:?messaggio}` fa fallire Compose se la variabile manca.
3. `docker compose up`: il catalog si collega? Se no, perché? (suggerimento: quando legge `POSTGRES_PASSWORD` l'immagine di Postgres?)
4. Controlla che `.env` sia ignorato da git con `git status`.

## 5. Rompere la cache dei layer

Nel Dockerfile di catalog sposta `COPY src ./src` **prima** di `RUN npm ci`, poi:

1. modifica un commento in `src/server.ts`;
2. ricostruisci e misura il tempo: `time docker build -t shop-catalog ./services/catalog`;
3. rimetti l'ordine giusto e ripeti.

Spiega la differenza in due righe. Rimetti il Dockerfile come prima.

## 6. Sviluppare dentro Docker con riavvio automatico

Crea `compose.dev.yaml` che, per il servizio `catalog`:

- costruisce solo la prima fase del Dockerfile (`build.target: build`);
- monta `./services/catalog/src` su `/app/src` con un bind mount;
- avvia `npx tsx watch src/server.ts`.

```bash
docker compose -f compose.yaml -f compose.dev.yaml up --build
```

Modifica il messaggio di `/health` e salva: il servizio si riavvia senza ricostruire l'immagine.

## Soluzioni

| File | Esercizi |
|---|---|
| `soluzione/services/catalog/Dockerfile.alpine` | 1 |
| `soluzione/compose.yaml` | 2, 3, 4 |
| `soluzione/compose.dev.yaml` | 6 |

Esercizio 5: con `COPY src` prima di `npm ci`, ogni modifica al codice invalida il layer di `npm ci` e tutti quelli dopo, quindi le dipendenze si reinstallano a ogni build. Copiando prima solo `package.json` e `package-lock.json`, `npm ci` si ripete solo quando cambiano le dipendenze.

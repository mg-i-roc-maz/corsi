# Corso: Microservizi, Caching ed Event-Driven

Repo del progetto fil rouge: un mini e-commerce che cresce lezione dopo lezione.

## Dove si trova il materiale

Tutto il corso è nel repo [corsi](https://github.com/mg-i-roc-maz/corsi), nella cartella `microservizi/`.

| Cartella | Contenuto |
|---|---|
| `lezione-3/start` | Punto di partenza della lezione 3: si lavora qui |
| `lezione-3/solution` | Soluzione completa della lezione 3 |
| `lezione-3/extra` | Esercizi extra e soluzioni |

## Struttura

```
gateway/nginx.conf   API Gateway: l'unico ingresso, porta 8080
services/catalog/    prodotti su PostgreSQL; nuova rotta interna per prenotare le scorte
services/orders/     ordini; chiede prezzi e scorte a catalog via HTTP
compose.yaml         gateway + servizi + database
http/shop.http       richieste pronte, tutte attraverso il gateway
```

## Lezione 3: progettare e far comunicare i servizi

Prima di iniziare segui [SETUP.md](SETUP.md). Come nella lezione 2, i comandi `docker` si lanciano dal terminale del computer, dalla cartella `lezione-3/start`.

### Parte 1: il contratto di catalog (10')

1. Leggi la nuova rotta in `services/catalog/src/routes.ts`: `POST /products/:id/reservations`.
2. Leggi `reserve` in `services/catalog/src/store/postgres.ts`: perché è **una sola** istruzione SQL?
3. Leggi `services/orders/src/catalog-client.ts`: è il "contratto" che orders si aspetta da catalog.

### Parte 2: orders chiama catalog (40')

```bash
cd services/orders
npm install
npm test        # all'inizio molti test falliscono
```

1. Completa i due `TODO` in `services/orders/src/catalog-client.ts`: `getProduct` e `reserve`.
2. Completa il `TODO` di `POST /orders` in `services/orders/src/routes.ts`.

| Caso | Risposta attesa |
|---|---|
| Tutto ok | 201, `"status": "confirmed"`, nomi e prezzi presi da catalog |
| Prodotto inesistente | 422 |
| Scorte insufficienti | 409 |
| catalog spento | 503 |

I test usano un catalog finto (`test/fake-catalog.ts`): non serve avviare niente. La consegna è completa quando `npm test` è tutto verde.

### Parte 3: il gateway (25')

1. Completa i `TODO` in `gateway/nginx.conf`.
2. In `compose.yaml` segui i `TODO` della Parte 3: aggiungi il servizio `gateway`, passa `CATALOG_URL` a orders e togli le porte pubblicate di catalog e orders.
3. Avvia tutto e prova `http/shop.http`:

```bash
docker compose up --build
```

### Parte 4: discovery e guasti (15')

Da un secondo terminale:

```bash
docker compose logs -f gateway                       # chi ha risposto a ogni richiesta?
docker compose up -d --scale catalog=2 --no-recreate # due copie di catalog
docker compose restart gateway                       # il gateway rilegge il DNS
docker compose stop catalog                          # e ora prova a ordinare
docker compose start catalog
```

1. Con due copie di catalog, quali indirizzi compaiono nei log del gateway?
2. Con catalog fermo, che codice risponde `POST /orders`? E `GET /products`? Perché sono diversi?

### Checkpoint

| Verifica | Esito atteso |
|---|---|
| `npm test` in `services/orders` | tutti verdi |
| `npm test` in `services/catalog` | tutti verdi (2 saltati senza `DATABASE_URL`) |
| `docker compose ps` | quattro servizi, solo il gateway con una porta pubblicata |
| `POST /api/v1/orders` | 201, `confirmed`, e le scorte in `GET /api/v1/products/p-1` calano |
| `POST /api/v1/products/p-1/reservations` | 403 dal gateway |
| `http://localhost:3001/products` | non risponde: catalog non è più pubblicato |

### Comandi utili

| Comando | A cosa serve |
|---|---|
| `docker compose exec orders node -e "fetch('http://catalog:3001/health').then(r=>r.text()).then(console.log)"` | chiama catalog da dentro orders, come fa il codice |
| `docker compose exec gateway nginx -t` | controlla la configurazione di nginx |
| `docker compose restart gateway` | riavvia il gateway dopo aver modificato `nginx.conf` |
| `docker compose logs -f gateway` | segue il log delle richieste |

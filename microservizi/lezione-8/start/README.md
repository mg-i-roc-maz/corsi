# Corso: Microservizi, Caching ed Event-Driven

Repo del progetto fil rouge: un mini e-commerce che cresce lezione dopo lezione. Questa è l'ultima tappa: il sistema completo.

## Dove si trova il materiale

Tutto il corso è nel repo [corsi](https://github.com/mg-i-roc-maz/corsi), nella cartella `microservizi/`.

| Cartella | Contenuto |
|---|---|
| `lezione-8/start` | Punto di partenza della lezione 8: si lavora qui |
| `lezione-8/solution` | Soluzione completa: il negozio finito |
| `lezione-8/extra` | Esercizi extra, test e soluzioni |
| `lezione-8/start/PROGETTO.md` | Il progetto finale dei gruppi e la demo |

## Il sistema completo

```
cliente ──HTTP──> gateway (nginx, cache HTTP)
                    ├──> catalog ──> PostgreSQL (catalog-db)
                    │       └──> Redis (cache-aside, ProductChanged)
                    ├──> orders  ──> PostgreSQL (orders-db: ordini e OUTBOX)
                    │       ├──HTTP──> catalog (prezzi, prenotazioni: timeout, retry, circuito)
                    │       └──relay──> RabbitMQ: OrderCreated
                    └──> notifications <── RabbitMQ (coda, attesa, DLQ)
                            └──> Redis (eventi già gestiti)
```

## Struttura

```
services/orders/
  db/init.sql                  nuovo: il database di orders, con la tabella outbox
  src/store.ts                 ordini ed eventi insieme (memoria); store-postgres.ts (PostgreSQL)
  src/outbox.ts                nuovo: il relay che pubblica gli eventi dell'outbox
services/notifications/
  src/broker.ts                coda principale, coda di attesa, DLQ
  src/consume.ts               tentativi contati: nuovo tentativo o DLQ
  src/seen.ts                  nuovo: gli eventi già gestiti, in Redis
  src/handlers.ts              ora idempotente
compose.yaml                   nuovo: orders-db
scripts/evento-doppio.sh       nuovo: lo stesso evento due volte
scripts/evento-rotto.sh        nuovo: un messaggio illeggibile
scripts/giro-completo.sh       nuovo: il controllo finale di tutto il sistema
```

## Lezione 8: pattern avanzati e progetto finale

Prima di iniziare segui [SETUP.md](SETUP.md). I comandi `docker` si lanciano dal terminale del computer, dalla cartella `lezione-8/start`.

### Parte 1: tentativi contati e Dead Letter Queue (25')

```bash
cd services/notifications
npm install
npm test        # all'inizio falliscono 5 test
```

1. Completa il `TODO 1` in `src/broker.ts` (DLX, DLQ, coda di attesa) e il `TODO 2` in `src/consume.ts` (nuovo tentativo o DLQ).
2. `docker compose up --build -d notifications`. Se nei log compare `PRECONDITION_FAILED`, cancella la coda `notifications.order-created` dalla Management UI.
3. **Un server di posta sempre giù.** `MAIL_FAIL_PERCENT=100 RETRY_DELAY_MS=3000 docker compose up -d notifications`, poi un ordine. Nella UI guarda le tre code; nei log i tentativi. Dove finisce il messaggio?
4. **Un messaggio rotto.** `./scripts/evento-rotto.sh`. Quanti tentativi fa notifications?

Alla fine: `docker compose up -d notifications` (senza variabili).

### Parte 2: il consumer idempotente (20')

1. Prima del TODO: `./scripts/evento-doppio.sh`. Quante email per `doppio@example.com` in `/api/v1/notifications`?
2. Completa il `TODO 3` in `src/handlers.ts`. `npm test` è verde.
3. `docker compose up --build -d notifications` e rilancia lo script. Ora? Guarda `duplicates` in `/stats/notifications`.
4. `docker compose exec redis redis-cli KEYS 'notifications:seen:*'`.

### Parte 3: l'Outbox (30')

```bash
cd services/orders
npm install
npm test        # all'inizio falliscono 5 test
```

1. Completa il `TODO 4` in `src/routes.ts` (l'evento insieme all'ordine) e il `TODO 5` in `src/outbox.ts` (il relay).
2. Leggi `create()` in `src/store-postgres.ts`: la transazione.
3. `docker compose up --build -d orders`, poi un ordine e `GET http://localhost:8080/stats/outbox`.
4. **RabbitMQ giù.** `docker compose stop rabbitmq`, `./scripts/ordini.sh 3`, poi `/stats/outbox`. `docker compose start rabbitmq`: cosa succede entro qualche secondo? Arrivano le email?
5. Guarda la tabella: `docker compose exec orders-db psql -U shop -d orders -c "SELECT id, routing_key, published_at FROM outbox"`.

### Parte 4: il giro completo (25')

```bash
./scripts/giro-completo.sh
```

Sette righe `OK`. Poi prepara la demo del gruppo: [PROGETTO.md](PROGETTO.md).

### Checkpoint

| Verifica | Esito atteso |
|---|---|
| `npm test` in orders e notifications | tutti verdi, alcuni saltati |
| posta sempre giù, un ordine | 3 tentativi, poi il messaggio nella DLQ |
| `./scripts/evento-rotto.sh` | subito nella DLQ, nessun tentativo |
| `./scripts/evento-doppio.sh` | una email, `duplicates` 1 |
| RabbitMQ fermo, 3 ordini | `pending` 3 nell'outbox, poi 0 e tre email |
| `./scripts/giro-completo.sh` | 7 OK, 0 NO |

### Le variabili nuove

| Variabile | Servizio | Default | Significato |
|---|---|---|---|
| `DATABASE_URL` | orders | nessuno | il database di orders; senza, in memoria |
| `OUTBOX_INTERVAL_MS` | orders | 500 | ogni quanto il relay cerca eventi da pubblicare |
| `MAX_ATTEMPTS` | notifications | 3 | tentativi in tutto, poi la DLQ |
| `RETRY_DELAY_MS` | notifications | 5000 | attesa tra un tentativo e l'altro |
| `REDIS_URL` | notifications | nessuno | dove ricordare gli eventi già gestiti |

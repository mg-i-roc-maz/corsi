# Corso: Microservizi, Caching ed Event-Driven

Repo del progetto fil rouge: un mini e-commerce che cresce lezione dopo lezione.

## Dove si trova il materiale

Tutto il corso è nel repo [corsi](https://github.com/mg-i-roc-maz/corsi), nella cartella `microservizi/`.

| Cartella | Contenuto |
|---|---|
| `lezione-7/start` | Punto di partenza della lezione 7: si lavora qui |
| `lezione-7/solution` | Soluzione completa della lezione 7 |
| `lezione-7/extra` | Esercizi extra, test e soluzioni |

## Struttura

```
gateway/nginx.conf             API Gateway sulla 8080; nuovo: /api/v1/notifications
services/catalog/              come nella lezione 6
services/orders/
  src/events.ts                nuovo: pubblica OrderCreated su RabbitMQ
services/notifications/        nuovo servizio: consuma OrderCreated e manda le email (finte)
  src/broker.ts                coda, binding, consumo
  src/consume.ts               ack e nack: dire a RabbitMQ com'è andata
  src/handlers.ts              cosa fare con ogni tipo di evento
  src/mailer.ts                il "server di posta": log e memoria
compose.yaml                   nuovi: rabbitmq, notifications
scripts/ordini.sh              nuovo: crea N ordini di fila
http/shop.http                 richieste pronte, tutte attraverso il gateway
```

## Lezione 7: architetture event-driven

Prima di iniziare segui [SETUP.md](SETUP.md). I comandi `docker` si lanciano dal terminale del computer, dalla cartella `lezione-7/start`.

### Parte 1: RabbitMQ nel Compose (10')

1. Completa il `TODO 1` in `compose.yaml`, poi togli il commento ai `depends_on` di orders e notifications.
2. `docker compose up --build -d` e apri la Management UI: http://localhost:15672 (utente `guest`, password `guest`).
3. Guarda le schede **Exchanges** e **Queues**: cosa c'è già? Chi l'ha creato?

### Parte 2: orders pubblica OrderCreated (25')

```bash
cd services/orders
npm install
npm test        # all'inizio falliscono 2 test
```

1. Completa il `TODO 2` in `src/events.ts` (exchange e pubblicazione) e il `TODO 3` in `src/routes.ts`.
2. `npm test` è verde. Ricostruisci: `docker compose up --build -d orders`.
3. Crea un ordine da `http/shop.http` e guarda i log di orders: `docker compose logs orders | grep -i evento`. Cosa dice? Perché?

### Parte 3: notifications consuma (25')

```bash
cd services/notifications
npm install
npm test        # all'inizio falliscono 6 test
```

1. Completa il `TODO 4` in `src/broker.ts` (coda e consumo) e il `TODO 5` in `src/consume.ts` (ack e nack).
2. `npm test` è verde. Ricostruisci: `docker compose up --build -d notifications`.
3. Crea un ordine e guarda `GET http://localhost:8080/api/v1/notifications`. Nella Management UI: la coda `notifications.order-created` e il suo binding.

### Parte 4: esperimenti (25')

1. **La coda aspetta.** `docker compose stop notifications`, poi `./scripts/ordini.sh 3`. Nella UI, quanti messaggi `Ready`? `docker compose start notifications`: cosa succede?
2. **Un server di posta inaffidabile.** `MAIL_FAIL_PERCENT=50 docker compose up -d notifications`, poi `./scripts/ordini.sh 5`. Guarda `/stats/notifications` e i log: quante riconsegne?
3. **Due copie al lavoro.** `MAIL_DELAY_MS=2000 PREFETCH=1 docker compose up -d --scale notifications=2`, poi `./scripts/ordini.sh 6` e `docker compose logs -f notifications`. Chi manda quali email? Nella UI: `Ready` e `Unacked`.
4. **Una caduta a metà lavoro.** `MAIL_DELAY_MS=10000 docker compose up -d --scale notifications=1`, crea un ordine e, entro 10 secondi, `docker compose kill notifications`. Nella UI il messaggio è tornato `Ready`? `docker compose start notifications` e guarda `redelivered` in `/stats/notifications`.

Alla fine rimetti tutto a posto: `docker compose up -d --scale notifications=1`.

### Checkpoint

| Verifica | Esito atteso |
|---|---|
| `npm test` in `services/orders` | tutti verdi, alcuni saltati |
| `npm test` in `services/notifications` | tutti verdi |
| un ordine | 201, e un'email in `/api/v1/notifications` |
| notifications fermo, 3 ordini | 3 messaggi `Ready` nella coda, poi consumati alla ripartenza |
| `MAIL_FAIL_PERCENT=50` | email tutte inviate prima o poi, `redelivered` > 0 |
| due copie, `PREFETCH=1` | le email si dividono tra le due |

### Le variabili nuove

| Variabile | Servizio | Default | Significato |
|---|---|---|---|
| `RABBITMQ_URL` | orders, notifications | nessuno | dove trovare RabbitMQ |
| `MAIL_FAIL_PERCENT` | notifications | 0 | percentuale di email che falliscono (simulato) |
| `MAIL_DELAY_MS` | notifications | 0 | quanto ci mette a mandare un'email (simulato) |
| `PREFETCH` | notifications | 10 | quanti messaggi non confermati può tenere una copia |

# Lezione 8 · Esercizi extra

Per chi finisce prima, per casa, o come punto di partenza per l'estensione del progetto finale ([PROGETTO.md](../solution/PROGETTO.md)). Si parte dalla propria cartella `lezione-8/start` completata. Le soluzioni sono in [`soluzione/`](soluzione/), con la stessa struttura del progetto: ogni file sostituisce quello omonimo.

Per gli esercizi 2, 3 e 4 ci sono test pronti:

```bash
cp ../extra/orders.extra.test.ts services/orders/test/extra.test.ts
cp ../extra/orders.extra-postgres.test.ts services/orders/test/extra-postgres.test.ts
cp ../extra/notifications.extra.test.ts services/notifications/test/extra.test.ts
```

Il test dell'esercizio 3 ha bisogno di PostgreSQL: `ORDERS_DATABASE_URL=postgres://shop:shop@localhost:5433/orders npm test` (la porta 5433 è quella di `orders-db`).

## 1. Chi c'è nella DLQ? (base, 10')

Nessuna riga di codice: la Management UI.

1. Manda un messaggio nella DLQ: `MAIL_FAIL_PERCENT=100 docker compose up -d notifications` e un ordine, oppure `./scripts/evento-rotto.sh`.
2. Queues › `notifications.order-created.dlq` › *Get messages*. Guarda l'header `x-death`: cosa dice? Quante volte, da quale coda, per quale motivo (`reason`)?
3. Confronta i due casi: un messaggio con tre tentativi falliti e uno illeggibile. Che differenza c'è in `x-attempt`?

Domanda: chi dovrebbe guardare la DLQ, e quando? Cosa dovrebbe far scattare un allarme?

## 2. Rimettere in coda la DLQ (medio, 20')

Il server di posta è tornato: i messaggi nella DLQ vanno rimandati.

- Un nuovo `notifications/src/replay-dlq.ts`: `replayDeadLetters(channel, { from, to })` prende i messaggi dalla DLQ uno alla volta (`channel.get`), toglie gli header `x-attempt` e `x-death`, li rimanda nella coda principale e conferma.
- I messaggi illeggibili restano nella DLQ: tornerebbero lì subito.
- Un comando: `src/replay-cli.ts`, con lo script `npm run dlq:riprova`.

Prova: tre messaggi nella DLQ, poi `docker compose up -d notifications` (posta di nuovo funzionante) e `docker compose exec notifications node dist/replay-cli.js`. Arrivano le tre email?

Domanda: se un messaggio era già stato gestito ed è finito nella DLQ per un altro motivo, rimetterlo in coda manda un'email doppia? (Pensa al consumer idempotente.)

## 3. Due copie di orders (avanzato, 30')

Con `docker compose up -d --scale orders=2` ci sono due relay. Tutti e due leggono gli stessi eventi non pubblicati e li pubblicano: ogni email parte due volte (notifications le riconosce come doppioni, ma il lavoro raddoppia).

- In `store-postgres.ts` un nuovo metodo `relayLocked(limit, publish)`: in una transazione, `SELECT ... FOR UPDATE SKIP LOCKED`, pubblica, segna come pubblicati, `COMMIT`.
- `FOR UPDATE` blocca le righe prese; `SKIP LOCKED` fa saltare all'altro relay quelle bloccate.
- In `outbox.ts`: se lo store ha `relayLocked`, `relayOnce` usa quello.

Prova: `docker compose up -d --scale orders=2`, `./scripts/ordini.sh 20`, poi guarda `duplicates` in `/stats/notifications`. Prima e dopo l'esercizio.

## 4. Annullare un ordine (medio, 25')

- orders: `POST /orders/:id/cancel`. Lo stato diventa `cancelled` e un evento `OrderCancelled` (routing key `order.cancelled`) va nell'outbox, nella stessa transazione.
- Annullare due volte: la seconda risponde 409 e non scrive un secondo evento.
- notifications: la coda si collega anche a `order.cancelled`, e manda l'email «Ordine o-3 annullato».

Domanda: l'ordine annullato aveva prenotato delle scorte. Chi le restituisce? orders chiama catalog, o catalog ascolta `OrderCancelled`? (È l'esercizio 5.)

## 5. La Saga del pagamento (carta e penna, 20')

Il negozio aggiunge il pagamento: un servizio `payments` che può rifiutare la carta. Un ordine ora ha tre passi: **prenotare le scorte** (catalog), **addebitare** (payments), **confermare** (orders). Se l'addebito fallisce, le scorte vanno restituite.

1. **Orchestrata.** orders guida i passi. Disegna i messaggi (comandi e risposte) per il caso felice e per il pagamento rifiutato.
2. **Coreografata.** Nessuno guida: ogni servizio reagisce agli eventi degli altri. Disegna gli eventi per gli stessi due casi.
3. Per ogni passo: qual è la **compensazione**? Si può sempre compensare? (Un'email inviata si può «annullare»?)
4. In quale delle due è più facile rispondere alla domanda «a che punto è l'ordine o-7?»

## Soluzioni

| File in `soluzione/` | Esercizi |
|---|---|
| `services/notifications/src/replay-dlq.ts`, `replay-cli.ts`, `package.json` | 2 |
| `services/orders/src/store.ts`, `store-postgres.ts`, `outbox.ts` | 3, 4 |
| `services/orders/src/events.ts`, `routes.ts` | 4 |
| `services/notifications/src/broker.ts`, `handlers.ts` | 4 |
| `services/*/test/extra*.test.ts` | test |

Esercizio 1: `x-death` è una lista; ogni elemento dice da quale coda (`queue`), per quale motivo (`reason`: `rejected` per un nack senza requeue, `expired` per un TTL scaduto) e quante volte (`count`). Il messaggio con tre tentativi ha `x-attempt: 2` (i due nuovi tentativi; il terzo fallimento lo ha mandato nella DLQ), quello illeggibile non ha `x-attempt`. La lunghezza della DLQ è una metrica da tenere d'occhio: un messaggio lì dentro vuol dire che qualcosa è andato storto e nessuno lo sta sistemando.

Esercizio 2: con il consumer idempotente un messaggio già gestito viene riconosciuto (`duplicates`) e non manda una seconda email, purché la chiave in Redis non sia scaduta (7 giorni). Un messaggio finisce nella DLQ proprio perché NON è stato gestito: di solito non c'è niente da riconoscere. Il replay va fatto dopo aver sistemato la causa, altrimenti i messaggi tornano nella DLQ dopo tre tentativi.

Esercizio 3: con `SKIP LOCKED` ogni evento viene pubblicato da un solo relay, e `duplicates` resta a 0. Il test ne avvia due in parallelo su 20 eventi e controlla che ogni evento esca una volta sola. Resta at-least-once: se un relay pubblica e cade prima del `COMMIT`, al giro dopo l'evento riparte.

Esercizio 4: le scorte non tornano da sole. Due strade: orders chiama catalog per restituirle (sincrono, come la prenotazione), oppure catalog ascolta `OrderCancelled` e le restituisce (evento). Con l'evento, il restituire va reso idempotente: un `OrderCancelled` riconsegnato non deve restituire le scorte due volte.

Esercizio 5, traccia. Orchestrata: orders manda `ReserveStock` → `StockReserved`, poi `ChargeCard` → `PaymentFailed`, poi `ReleaseStock` → `StockReleased`, infine segna l'ordine `rejected`. Coreografata: orders pubblica `OrderPlaced`; catalog reagisce e pubblica `StockReserved`; payments reagisce e pubblica `PaymentFailed`; catalog reagisce restituendo le scorte e orders segnando l'ordine. Compensazioni: prenotare → restituire; addebitare → rimborsare; un'email non si annulla, se ne manda un'altra («il tuo ordine è stato annullato»). L'orchestrata ha un punto solo che sa tutto (più facile da seguire e da correggere, ma accoppiato); la coreografata è più disaccoppiata ma lo stato dell'ordine va ricostruito dagli eventi di tutti.

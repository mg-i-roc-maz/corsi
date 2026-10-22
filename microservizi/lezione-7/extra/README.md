# Lezione 7 · Esercizi extra

Per chi finisce prima o vuole approfondire a casa. Si parte dalla propria cartella `lezione-7/start` completata. Le soluzioni sono in [`soluzione/`](soluzione/), con la stessa struttura del progetto: ogni file sostituisce quello omonimo.

Per gli esercizi 3 e 4 ci sono test pronti:

```bash
cp ../extra/orders.extra.test.ts services/orders/test/extra.test.ts
cp ../extra/notifications.extra.test.ts services/notifications/test/extra.test.ts
```

## 1. Un ascoltatore nuovo, senza toccare orders (base, 15')

Il reparto vendite vuole vedere tutti gli eventi degli ordini. Nessuna riga di codice: solo la Management UI (http://localhost:15672).

1. **Queues** › *Add a new queue*: nome `vendite.tutto`, durable.
2. Apri la coda › *Bindings*: from exchange `shop.events`, routing key `order.*`.
3. Crea due ordini, poi nella coda *Get messages*. Cosa contengono?
4. Prova anche la routing key `#`. Che differenza c'è con `order.*`?

Domande: orders è cambiato? Cosa succede a notifications? Cosa succederebbe alla coda `vendite.tutto` se nessuno la leggesse mai?

## 2. ProductChanged su RabbitMQ (medio, 25')

Nella lezione 6 gli avvisi `ProductChanged` viaggiano su Redis Pub/Sub: se orders è scollegato, sono persi. Spostali su RabbitMQ.

- catalog: un nuovo `src/rabbit-notifier.ts` che pubblica su `shop.events` con routing key `product.changed`. Nuova dipendenza: `npm install amqplib`.
- orders: un nuovo `src/product-events.ts` con una coda **sua**, `orders.product-changed`, collegata a `product.changed`. Per ogni messaggio: `parseProductChanged`, butta la copia, `ack`.
- `compose.yaml`: `RABBITMQ_URL` anche per catalog, e catalog dipende da rabbitmq.

Prova: nella UI ora ci sono due binding su `shop.events`. Ferma orders, fai tre PUT, guarda la coda `orders.product-changed`: quanti messaggi `Ready`?

Domanda: la cache locale di orders è in memoria, quindi dopo un riavvio è vuota comunque. In che caso la coda fa davvero la differenza rispetto a Pub/Sub?

## 3. OrderCreated versione 2 (medio, 20')

Il team di orders vuole cambiare il contratto: il cliente diventa un oggetto `customer: { email, name }` e arriva il campo `currency`. Chi legge la versione 1 si rompe.

- In `notifications/src/handlers.ts` accetta le versioni 1 **e** 2, e porta tutte e due alla stessa forma (`normalize`).
- Con il nome del cliente, l'email inizia con «Ciao Bruno».
- Una versione sconosciuta (3) si ignora e si conferma, senza errori.

Domande: in che ordine si fa il rilascio, orders o notifications prima? Per quanto tempo orders deve continuare a pubblicare la v1?

## 4. Riprovare la pubblicazione (avanzato, 25')

Oggi, con RabbitMQ giù, l'evento `OrderCreated` è perso e l'email non parte mai.

- Un nuovo `orders/src/retry-buffer.ts`: `withRetryBuffer(events)` avvolge il publisher. Se la pubblicazione fallisce, l'evento va in un buffer in memoria e si riprova ogni 5 secondi.
- Gli eventi in attesa partono prima di quelli nuovi, per non cambiarne l'ordine.
- Oltre un massimo (1000) il più vecchio si perde, con un log.

Prova: `docker compose stop rabbitmq`, due ordini, `docker compose start rabbitmq`. Arrivano le email?

Domanda: cosa succede agli eventi nel buffer se orders si riavvia mentre RabbitMQ è giù? (Risposta nella lezione 8: l'Outbox.)

## 5. Comandi o eventi? (carta e penna, 15')

Per ogni messaggio: è un **comando** o un **evento**? Chi lo manda, chi lo riceve, quanti lo ricevono? Cosa succede se arriva due volte?

| Messaggio | Comando o evento? | Da chi | A chi | Se arriva due volte |
|---|---|---|---|---|
| `SendEmail` | | | | |
| `OrderCreated` | | | | |
| `ReserveStock` | | | | |
| `StockReserved` | | | | |
| `ChargeCard` | | | | |
| `PaymentFailed` | | | | |
| `ProductChanged` | | | | |

## Soluzioni

| File in `soluzione/` | Esercizi |
|---|---|
| `compose.yaml`, `services/catalog/package.json`, `src/rabbit-notifier.ts`, `src/server.ts` | 2 |
| `services/orders/src/product-events.ts` | 2 |
| `services/orders/src/retry-buffer.ts` | 4 |
| `services/orders/src/server.ts` | 2, 4 |
| `services/notifications/src/handlers.ts` | 3 |
| `services/*/test/extra.test.ts` | test |

Esercizio 1: orders non cambia e notifications non se ne accorge: ogni coda riceve la sua copia del messaggio. `order.*` prende le chiavi con una sola parola dopo `order.` (`order.created`, `order.shipped`); `#` prende tutto, anche `product.changed`. Una coda che nessuno legge cresce per sempre: memoria e disco di RabbitMQ. Si limita con una lunghezza massima o un TTL dei messaggi (`x-max-length`, `x-message-ttl`).

Esercizio 2: i messaggi aspettano in coda anche con orders spento: tre `Ready`. La differenza con Pub/Sub si vede quando orders resta acceso ma perde la connessione (rete, Redis riavviato): con Pub/Sub la cache resta piena e gli avvisi sono persi, con la coda arrivano alla riconnessione. E con più copie di orders? Ognuna ha una cache sua: ognuna deve ricevere ogni avviso. Con una sola coda le copie si dividerebbero i messaggi (competing consumers); servono code separate, per esempio una coda esclusiva per copia. È il prossimo passo.

Esercizio 3: prima notifications (che capisce v1 e v2), poi orders (che passa a v2). Al contrario, per un periodo notifications riceverebbe v2 senza saperla leggere. orders pubblica la v1 finché tutti quelli che la leggono non sono aggiornati; con più consumatori, a volte si pubblicano entrambe per un periodo.

Esercizio 4: il buffer è in memoria: un riavvio di orders mentre RabbitMQ è giù perde gli eventi in attesa, e le email non partono. La soluzione è scrivere l'evento nello stesso database dell'ordine, nella stessa transazione, e pubblicarlo dopo: il pattern Outbox della lezione 8.

Esercizio 5, traccia. Comandi (un destinatario, chiedono di fare qualcosa, possono essere rifiutati): `SendEmail`, `ReserveStock`, `ChargeCard`. Eventi (raccontano un fatto già successo, chiunque può ascoltare): `OrderCreated`, `StockReserved`, `PaymentFailed`, `ProductChanged`. Se arrivano due volte: un'email doppia è fastidiosa; un `ReserveStock` o un `ChargeCard` doppio è grave (scorte o soldi tolti due volte); un `ProductChanged` doppio non fa danni (buttare una copia due volte è innocuo: è idempotente). Ecco perché nella lezione 8 il consumer diventa idempotente.

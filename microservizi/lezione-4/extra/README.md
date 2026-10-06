# Lezione 4 · Esercizi extra

Per chi finisce prima o vuole approfondire a casa. Si parte dalla propria cartella `lezione-4/start` completata. Le soluzioni sono in [`soluzione/`](soluzione/), con la stessa struttura del progetto: ogni file sostituisce quello omonimo.

Per gli esercizi 1, 2 e 4 ci sono test pronti:

```bash
cp ../extra/orders.extra.test.ts services/orders/test/extra.test.ts
```

Finché non hai scritto il codice, `npm run typecheck` segnala i metodi mancanti: è normale.

## 1. I numeri del circuito (base, 15')

Lo stato `open` o `closed` dice poco. Aggiungi a `GET /health/ready` di orders i contatori del circuito: chiamate, successi, fallimenti, timeout, rifiutate.

- In `catalog-client.ts` aggiungi `circuitStats()`, che legge `breaker.stats` di opossum.
- In `app.ts` mettili sotto `dependencies.catalog.stats`.

Ripeti l'esperimento con `docker compose pause catalog` e guarda i numeri in `GET http://localhost:8080/health/orders`. Quale contatore cresce quando il circuito è aperto?

## 2. Una paratia tra orders e catalog (medio, 20')

Con catalog lento, ogni ordine tiene occupata una chiamata per secondi. Con cento ordini insieme, orders ha cento chiamate appese. Il pattern **bulkhead** (la paratia stagna di una nave) limita il danno: al massimo N chiamate contemporanee, le altre vengono rifiutate subito.

- opossum ha l'opzione `capacity`; oltre il limite `fire` fallisce con `code: "ESEMLOCKED"`.
- Traduci quell'errore in `CatalogUnavailableError` con `kind: "too_busy"`, e non riprovarlo.
- Rendi il limite configurabile: `CATALOG_MAX_CONCURRENT`, default 20.

Domanda: meglio rifiutare subito o mettere in coda? Cosa succede a una coda quando catalog resta lento per minuti?

## 3. Retry nel gateway (medio, 20')

Con due copie di catalog, se una risponde 503 il gateway può provare l'altra.

1. Nella location dei prodotti di `nginx.conf` aggiungi `proxy_next_upstream error timeout http_502 http_503;` e `proxy_next_upstream_tries 2;`.
2. Avvia due copie e rendine una inaffidabile:

```bash
CHAOS_FAIL_PERCENT=50 docker compose up -d --scale catalog=2
docker compose restart gateway
```

3. Invia venti volte `GET /api/v1/products/p-2`. Quanti errori vedi? Nei log del gateway, cosa compare dopo la freccia quando una richiesta è stata ripetuta?

Domanda: nginx ripete anche i `POST`? Perché è giusto così?

Nota: con `--scale` il chaos vale per tutte e due le copie. Per averne una sola guasta, prova a fermare un container con `docker stop shop-catalog-2`.

## 4. Fallback con l'ultimo prezzo noto (avanzato, 25')

Quando catalog non risponde, orders potrebbe usare l'ultimo prodotto letto, se è abbastanza recente.

- In `catalog-client.ts` tieni una `Map` con l'ultimo prodotto letto per id e l'ora della lettura.
- Se `getProduct` fallisce e c'è una lettura più giovane di `CATALOG_FALLBACK_MAX_AGE_MS`, restituiscila con `stale: true`.
- Con il valore 0 (default) il fallback è spento.

Domande da discutere prima di scrivere codice:

1. Il prezzo può essere cambiato nel frattempo. Chi perde, il negozio o il cliente?
2. Le scorte: la prenotazione passa comunque da catalog. Il fallback serve davvero, in questo flusso?
3. Dove sarebbe più utile un fallback così? (Suggerimento: lezione 5.)

## 5. Il budget dei tempi (carta e penna, 15')

Configurazione di oggi: timeout verso catalog 2 secondi, 2 tentativi in più per le letture (attese fino a 100 e 200 ms), circuito che si apre dopo 5 chiamate con almeno metà di errori. Il gateway aspetta orders al massimo 10 secondi.

1. catalog è bloccato. Un cliente ordina **tre** prodotti diversi. Quanto aspetta orders, al massimo, prima di rispondere? Considera anche il circuito.
2. Cosa riceve il cliente se orders ci mette più di 10 secondi? E orders, nel frattempo, si ferma?
3. Il cliente riprova perché ha visto un errore. Cosa può succedere all'ordine?
4. Proponi due modifiche alla configurazione o al codice per stare dentro il budget.

## Soluzioni

| File in `soluzione/` | Esercizi |
|---|---|
| `services/orders/src/catalog-client.ts` | 1, 2, 4 |
| `services/orders/src/app.ts`, `config.ts`, `server.ts`, `routes.ts` | 1, 2, 4 |
| `gateway/nginx.conf` | 3 |
| `services/orders/test/extra.test.ts` | test |

Esercizio 3: nginx non ripete una richiesta non idempotente (POST, PATCH) su un'altra copia, perché la prima potrebbe averla già eseguita: è la stessa ragione per cui orders non ripete le prenotazioni.

Esercizio 5, traccia di risposta. Senza circuito ogni riga costa fino a circa 6,3 secondi (tre tentativi da 2 secondi più le attese), quindi tre righe arrivano a circa 19 secondi. Con il circuito: la prima riga fallisce dopo 3 errori, la seconda al secondo errore arriva a 5 e apre il circuito, quindi orders risponde dopo circa 10 secondi, proprio al limite del gateway. Se il gateway scade prima, il cliente riceve un 502 ma orders continua a lavorare e, se catalog riprende in tempo, l'ordine viene confermato: il cliente riprova e ne crea un secondo. Rimedi: un timeout complessivo per l'ordine più corto di quello del gateway, meno tentativi o un timeout più breve, una sola lettura per tutte le righe (esercizio 2 della lezione 3), e una chiave di idempotenza per gli ordini (lezione 8).

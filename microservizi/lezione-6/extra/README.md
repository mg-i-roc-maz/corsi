# Lezione 6 · Esercizi extra

Per chi finisce prima o vuole approfondire a casa. Si parte dalla propria cartella `lezione-6/start` completata. Le soluzioni sono in [`soluzione/`](soluzione/), con la stessa struttura del progetto: ogni file sostituisce quello omonimo.

Per gli esercizi 1–4 ci sono test pronti:

```bash
cp ../extra/catalog.extra.test.ts services/catalog/test/extra.test.ts
cp ../extra/orders.extra.test.ts services/orders/test/extra.test.ts
```

Finché non hai scritto il codice, `npm run typecheck` segnala le opzioni e i metodi mancanti: è normale.

## 1. Una copia scaduta, ma subito (base, 15')

Oggi, dopo `max-age`, la prima richiesta che arriva al gateway trova la copia scaduta. Con `stale-while-revalidate` catalog dice: "dopo la scadenza, per altri N secondi puoi ancora usare la copia vecchia, mentre ne chiedi una nuova in sottofondo".

- In `src/http-cache.ts` aggiungi a `sendCacheable` un parametro `staleWhileRevalidateSeconds` (default 0).
- Se è maggiore di 0, l'header diventa `public, max-age=10, stale-while-revalidate=30`.
- Variabile d'ambiente: `HTTP_SWR_SECONDS`.

Il nostro gateway lo fa già, per configurazione (`proxy_cache_use_stale updating` e `proxy_cache_background_update`): guarda lo `STALE` in `misura.sh` dopo 11 secondi. Con l'header lo possono fare tutte le cache, anche quella del browser, senza configurarle una per una: la regola la dà chi conosce il dato.

Domanda: perché per un prezzo 30 secondi di `stale-while-revalidate` possono essere troppi, e per la descrizione no?

## 2. Dopo una riconnessione (base, 15')

Redis Pub/Sub non conserva i messaggi. Se orders perde la connessione per un minuto, gli avvisi `ProductChanged` di quel minuto sono persi, e la cache locale può tenere prezzi vecchi fino al TTL.

- In `src/local-cache.ts` aggiungi il metodo `clear()`, che butta tutte le copie.
- In `src/invalidation.ts` aggiungi l'opzione `onConnected`, chiamata a ogni evento `ready` del client Redis.
- In `src/server.ts` collega le due cose.

Prova: crea un ordine, `docker compose stop redis`, cambia il prezzo (la PUT funziona: catalog va al database), `docker compose start redis`, crea un altro ordine. Che prezzo ha?

## 3. La cache privata degli ordini (medio, 20')

Il gateway non tiene in cache gli ordini, ma un browser potrebbe. Un ordine è un dato **personale**: va bene nel browser di chi l'ha fatto, mai in una cache condivisa.

- Su `GET /orders/:id` di orders: `Cache-Control: private, no-cache` e un'`ETag`.
- Con `If-None-Match` uguale: 304 senza corpo.

Domande: che differenza c'è tra `no-cache` e `no-store`? Cosa succederebbe se per errore la risposta fosse `public, max-age=60` e il gateway avesse la cache attiva anche sugli ordini?

## 4. Due livelli in catalog (avanzato, 30')

Con tre copie di catalog, ogni lettura chiede comunque a Redis: una chiamata di rete. Una cache locale (L1) di pochi secondi, davanti a Redis (L2), toglie anche quella.

- In `src/product-cache.ts` aggiungi l'opzione `localTtlMs` (default 0 = spenta): una `Map` nel processo, consultata prima di Redis. Trovato lì: `X-Cache: LOCAL`.
- Una PUT butta anche la copia locale.
- Il problema vero: la PUT arriva a UNA copia di catalog. Le altre due come lo sanno? Iscrivi catalog al canale `catalog.products` e, a ogni avviso, butta la copia locale (`dropLocal`).
- Variabile d'ambiente: `CACHE_LOCAL_TTL_MS`.

Prova con `CACHE_LOCAL_TTL_MS=5000 docker compose up -d --scale catalog=3`. Nota: con `--scale` il gateway va riavviato (`docker compose restart gateway`), e conviene spegnere la sua cache (`HTTP_MAX_AGE_SECONDS=0`) per vedere le risposte di catalog.

## 5. Quante richieste arrivano al database? (carta e penna, 15')

Diecimila letture di prodotti in un minuto. Il browser serve dalla sua cache il 40% delle letture, il gateway il 70% di quelle che gli arrivano, Redis il 95% di quelle che arrivano a catalog.

1. Quante letture arrivano al gateway? A catalog? Al database?
2. Tempi: browser 0 ms, gateway 1 ms, Redis 3 ms, database 100 ms. Qual è il tempo medio di una lettura?
3. Il gateway si spegne e viene sostituito da uno senza cache. Cosa cambia per il database?
4. Dove conviene lavorare per migliorare: sul 70% del gateway o sul 95% di Redis?

## Soluzioni

| File in `soluzione/` | Esercizi |
|---|---|
| `services/catalog/src/http-cache.ts`, `routes.ts` | 1 |
| `services/catalog/src/product-cache.ts`, `notifier.ts` | 4 |
| `services/catalog/src/app.ts`, `server.ts` | 1, 4 |
| `services/orders/src/local-cache.ts`, `invalidation.ts`, `server.ts` | 2 |
| `services/orders/src/http-cache.ts`, `routes.ts` | 3 |
| `services/*/test/extra.test.ts` | test |

Esercizio 1: `stale-while-revalidate` sposta l'attesa del rinnovo dal cliente al sottofondo, ma allunga il tempo in cui si vede un dato vecchio: `max-age` più `stale-while-revalidate` è il caso peggiore. nginx lo rispetta dalla versione 1.11.10; i browser moderni anche.

Esercizio 2: dopo la riconnessione orders butta tutte le copie e rilegge i prezzi da catalog: il secondo ordine ha il prezzo nuovo. È la regola generale: se non sai cosa ti sei perso, ricomincia da zero. Nella lezione 7 una coda RabbitMQ conserva gli avvisi mentre orders è scollegato.

Esercizio 3: `no-cache` permette di tenere la copia ma obbliga a ricontrollarla (If-None-Match) prima di usarla; `no-store` vieta di tenerla. Con `public` e la cache nel gateway, il primo cliente che legge un ordine lo farebbe vedere agli altri che chiedono lo stesso indirizzo: una fuga di dati personali. In più, nel nostro negozio gli ordini non hanno autenticazione: chiunque conosca l'id li legge. È un problema da risolvere prima ancora della cache.

Esercizio 4: senza l'iscrizione, una PUT su una copia di catalog lascia il prezzo vecchio nelle cache locali delle altre due, fino a `CACHE_LOCAL_TTL_MS`. Con l'iscrizione, l'avviso arriva a tutte. Il TTL locale va tenuto molto corto (pochi secondi): è l'unica difesa se un avviso si perde.

Esercizio 5, traccia. 1: al gateway 6.000 (il 60% di 10.000), a catalog 1.800 (il 30% di 6.000), al database 90 (il 5% di 1.800). 2: 4.000 × 0 + 4.200 × 1 + 1.710 × 3 + 90 × 100 = 18.330 ms su 10.000 letture, circa 1,8 ms di media. 3: a catalog arrivano 6.000 letture, al database 300: più del triplo. 4: portare Redis dal 95% al 99% toglie 72 letture al database su 90; portare il gateway dal 70% all'80% ne toglie 30. Dipende da dove costa di più: qui il database.

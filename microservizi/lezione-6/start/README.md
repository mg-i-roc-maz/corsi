# Corso: Microservizi, Caching ed Event-Driven

Repo del progetto fil rouge: un mini e-commerce che cresce lezione dopo lezione.

## Dove si trova il materiale

Tutto il corso è nel repo [corsi](https://github.com/mg-i-roc-maz/corsi), nella cartella `microservizi/`.

| Cartella | Contenuto |
|---|---|
| `lezione-6/start` | Punto di partenza della lezione 6: si lavora qui |
| `lezione-6/solution` | Soluzione completa della lezione 6 |
| `lezione-6/extra` | Esercizi extra, test e soluzioni |

## Struttura

```
gateway/nginx.conf             API Gateway sulla 8080; nuovo: cache HTTP dei prodotti
services/catalog/
  src/http-cache.ts            nuovo: Cache-Control, ETag e 304
  src/product-cache.ts         cache-aside su Redis; nuovo: single flight contro lo stampede
  src/notifier.ts              nuovo: annuncia ProductChanged sul canale Redis catalog.products
services/orders/
  src/local-cache.ts           nuovo: copia locale di nome e prezzo dei prodotti
  src/invalidation.ts          nuovo: ascolta ProductChanged e butta la copia locale
compose.yaml                   nuovo: servizio k6 (profilo "strumenti")
k6/carico.js                   nuovo: test di carico
scripts/misura.sh              tempi, cache del gateway e cache di catalog
scripts/stampede.sh            nuovo: quante letture arrivano al database sotto carico
http/shop.http                 richieste pronte, tutte attraverso il gateway
```

## Lezione 6: caching nei microservizi

Prima di iniziare segui [SETUP.md](SETUP.md). I comandi `docker` si lanciano dal terminale del computer, dalla cartella `lezione-6/start`.

### Parte 1: Cache-Control ed ETag (20')

```bash
cd services/catalog
npm install
npm test        # all'inizio falliscono 7 test
```

Completa il `TODO 1` in `src/http-cache.ts`. Poi ricostruisci e guarda gli header:

```bash
docker compose up --build -d
curl -i http://localhost:8080/api/v1/products/p-1
curl -i -H 'If-None-Match: "<etag della risposta>"' http://localhost:8080/api/v1/products/p-1
```

La seconda risposta deve essere `304 Not Modified`, senza corpo.

### Parte 2: la cache del gateway (20')

1. Completa il `TODO 2` in `gateway/nginx.conf`.
2. `docker compose restart gateway`, poi `./scripts/misura.sh`.

Il primo tempo è un `MISS` del gateway, gli altri `HIT`: catalog non viene nemmeno chiamato.

3. Cambia il prezzo di `p-1` con la `PUT` di `http/shop.http` e rileggilo dal gateway. Per quanto tempo vedi il prezzo vecchio? Da cosa dipende?

### Parte 3: misurare sotto carico con k6 (15')

```bash
docker compose run --rm k6 run /scripts/carico.js
docker compose run --rm k6 run -e BASE=http://catalog:3001 /scripts/carico.js
```

Il primo passa dal gateway, il secondo va direttamente a catalog. Confronta `http_reqs` (richieste al secondo) e `http_req_duration` (soprattutto `p(95)`).

### Parte 4: lo stampede (25')

1. Rendi lo stampede visibile: cache brevissima e database lento.

```bash
CACHE_TTL_SECONDS=5 DB_DELAY_MS=300 docker compose up -d catalog
./scripts/stampede.sh
```

Annota le letture dal database: 50 utenti per 30 secondi, una chiave che scade ogni 5 secondi.

2. Completa il `TODO 3` in `src/product-cache.ts` (single flight). `npm test`: passano i due test sullo stampede.
3. Ricostruisci con le stesse variabili e rilancia `./scripts/stampede.sh`. Quante letture ora?
4. Completa il `TODO 4` in `gateway/nginx.conf`: lo stesso rimedio, nel gateway.

### Parte 5: invalidazione tra servizi (20')

orders ora tiene una copia locale di nome e prezzo dei prodotti, per 60 secondi.

1. Crea un ordine di `p-1`, cambia il prezzo di `p-1` con la `PUT`, crea un altro ordine. Che prezzo ha la seconda riga? Guarda `GET /stats/orders-cache`.
2. Completa il `TODO 5` in `services/catalog/src/product-cache.ts` e il `TODO 6` in `services/orders/src/invalidation.ts` e `src/server.ts`.
3. `docker compose up --build -d` e ripeti il punto 1. Guarda i log di orders.
4. In un altro terminale: `docker compose exec redis redis-cli SUBSCRIBE catalog.products`, poi rifai la `PUT`.

### Checkpoint

| Verifica | Esito atteso |
|---|---|
| `npm test` in `services/catalog` | tutti verdi, 4 saltati |
| `npm test` in `services/orders` | tutti verdi, 1 saltato |
| `curl -i` con `If-None-Match` | `304 Not Modified` |
| `./scripts/misura.sh` | un `MISS` del gateway, poi `HIT` in 1–2 ms |
| `./scripts/stampede.sh` con TTL 5 e ritardo 300 | circa 6 letture dal database invece di circa 300 |
| ordine, `PUT` del prezzo, ordine | il secondo ordine ha il prezzo nuovo |

### Le variabili nuove

| Variabile | Servizio | Default | Significato |
|---|---|---|---|
| `HTTP_MAX_AGE_SECONDS` | catalog | 10 | `max-age` delle risposte: per quanto gateway e browser tengono una copia |
| `CATALOG_CACHE_TTL_MS` | orders | 60000 | quanto vive la copia locale di un prodotto in orders; 0 = spenta |
| `REDIS_URL` | orders | nessuno | dove ascoltare gli avvisi `ProductChanged` |

Restano quelle della lezione 5: `CACHE_TTL_SECONDS`, `DB_DELAY_MS`, `REDIS_URL` di catalog.

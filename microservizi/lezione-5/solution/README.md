# Corso: Microservizi, Caching ed Event-Driven

Repo del progetto fil rouge: un mini e-commerce che cresce lezione dopo lezione.

## Dove si trova il materiale

Tutto il corso è nel repo [corsi](https://github.com/mg-i-roc-maz/corsi), nella cartella `microservizi/`.

| Cartella | Contenuto |
|---|---|
| `lezione-5/start` | Punto di partenza della lezione 5: si lavora qui |
| `lezione-5/solution` | Soluzione completa della lezione 5 |
| `lezione-5/extra` | Esercizi extra, test e soluzioni |

## Struttura

```
gateway/nginx.conf             API Gateway sulla 8080; nuovo: /stats/cache
services/catalog/
  src/cache.ts                 la cache: Redis oppure memoria, con la stessa interfaccia
  src/product-cache.ts         cache-aside per i prodotti, con le statistiche
  src/store/slow.ts            simula un database lento (DB_DELAY_MS)
services/orders/               come nella lezione 4
compose.yaml                   nuovo servizio redis
scripts/misura.sh              misura i tempi di risposta di un prodotto
http/shop.http                 richieste pronte, tutte attraverso il gateway
```

## Lezione 5: caching, i fondamenti

Prima di iniziare segui [SETUP.md](SETUP.md). I comandi `docker` si lanciano dal terminale del computer, dalla cartella `lezione-5/start`.

### Parte 1: quanto costa una lettura? (10')

```bash
docker compose up --build -d
./scripts/misura.sh
```

catalog simula una query lenta: ogni lettura dal database costa circa 100 ms (`DB_DELAY_MS`). Annota i tempi. L'header `X-Cache` dice `BYPASS`: la cache non c'è ancora.

Su Windows lancia lo script da Git Bash, oppure invia più volte `GET /products/p-1` da `http/shop.http` e guarda la durata in basso.

### Parte 2: il cache-aside (25')

```bash
cd services/catalog
npm install
npm test        # all'inizio falliscono 5 test
```

Completa il `TODO 1` in `src/product-cache.ts`. I test usano una cache in memoria: Redis non serve ancora. Alla fine restano rossi solo i tre test sull'invalidazione.

### Parte 3: Redis nel Compose (15')

1. Completa i `TODO 5` e `6` in `compose.yaml`.
2. Ricostruisci e misura di nuovo:

```bash
docker compose up --build -d
./scripts/misura.sh
```

Il primo tempo è un `MISS`, gli altri `HIT`. Di quanto sono più veloci?

### Parte 4: l'invalidazione (20')

1. Da `http/shop.http`: leggi `p-1`, poi cambia il prezzo con la `PUT`, poi rileggi. Che prezzo vedi?
2. Completa i `TODO 2`, `3` e `4` in `src/routes.ts`. Ora `npm test` è tutto verde.
3. Ricostruisci e ripeti il punto 1.

### Parte 5: dentro Redis (15')

```bash
docker compose exec redis redis-cli
```

```
KEYS product:*
GET product:p-1
TTL product:p-1
INFO stats            (cerca keyspace_hits e keyspace_misses)
MONITOR               (ora fai qualche richiesta; Ctrl+C per uscire)
```

Poi due esperimenti:

1. **Il dato vecchio.** Leggi `p-2` (va in cache), poi cambia il prezzo direttamente nel database, scavalcando catalog:

```bash
docker compose exec catalog-db psql -U shop -d catalog -c "UPDATE products SET price_cents = 1 WHERE id = 'p-2';"
```

Rileggi `p-2` più volte. Quando vedi il prezzo nuovo? Perché?

2. **Redis spento.** `docker compose stop redis`, poi `./scripts/misura.sh`. catalog risponde ancora? Con che tempi e che `X-Cache`? Poi `docker compose start redis`.

### Checkpoint

| Verifica | Esito atteso |
|---|---|
| `npm test` in `services/catalog` | tutti verdi, 4 saltati senza `DATABASE_URL` e `REDIS_URL` |
| `./scripts/misura.sh` | un `MISS` da circa 100 ms, poi `HIT` da pochi ms |
| `PUT` e poi `GET` dello stesso prodotto | il prezzo nuovo, con `X-Cache: MISS` |
| `TTL product:p-1` in redis-cli | un numero tra 0 e 60 |
| `docker compose stop redis` | catalog risponde, con `X-Cache: BYPASS` |
| `GET /stats/cache` | hit, miss e hit ratio |

### Le variabili di catalog

| Variabile | Default | Significato |
|---|---|---|
| `REDIS_URL` | nessuno | dove trovare Redis; senza, cache in memoria del processo |
| `CACHE_TTL_SECONDS` | 60 | quanto vive una copia in cache |
| `DB_DELAY_MS` | 0 (100 nel Compose) | ritardo simulato di ogni lettura dal database |

Si cambiano senza toccare il codice: `CACHE_TTL_SECONDS=10 docker compose up -d catalog`.

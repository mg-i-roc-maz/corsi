# Corso: Microservizi, Caching ed Event-Driven

Repo del progetto fil rouge: un mini e-commerce che cresce lezione dopo lezione.

## Dove si trova il materiale

Tutto il corso è nel repo [corsi](https://github.com/mg-i-roc-maz/corsi), nella cartella `microservizi/`.

| Cartella | Contenuto |
|---|---|
| `lezione-4/start` | Punto di partenza della lezione 4: si lavora qui |
| `lezione-4/solution` | Soluzione completa della lezione 4 |
| `lezione-4/extra` | Esercizi extra, test e soluzioni |

## Struttura

```
gateway/nginx.conf          API Gateway sulla 8080; ora con timeout e correlation ID
services/catalog/           prodotti su PostgreSQL; /health/live, /health/ready, "chaos" per gli esperimenti
services/orders/
  src/config.ts             tutta la configurazione, letta e controllata all'avvio
  src/catalog-client.ts     timeout, retry e circuit breaker verso catalog
  src/retry.ts              retry con backoff esponenziale e jitter
compose.yaml                healthcheck, riavvio automatico, variabili di resilienza
http/shop.http              richieste pronte, tutte attraverso il gateway
```

## Lezione 4: resilienza e configurazione

Prima di iniziare segui [SETUP.md](SETUP.md). I comandi `docker` si lanciano dal terminale del computer, dalla cartella `lezione-4/start`.

### Parte 1: l'esperimento (15')

```bash
docker compose up --build -d
docker compose logs -f orders          # in un secondo terminale
```

1. Crea un ordine con `http/shop.http`: tutto ok.
2. `docker compose pause catalog`: catalog è acceso ma bloccato, non risponde. Crea un ordine. Quanto aspetti?
3. Mentre aspetti, apri `GET /api/v1/products`: risponde?
4. `docker compose unpause catalog`. Poi `docker compose stop catalog` e riprova: che differenza c'è con la pausa?
5. `docker compose start catalog`.

### Parte 2: il timeout (20')

```bash
cd services/orders
npm install
npm test           # all'inizio falliscono 6 test
```

Completa il `TODO 1` in `src/catalog-client.ts`: nessuna chiamata a catalog deve aspettare più di `timeoutMs`.

### Parte 3: retry con backoff (20')

1. Completa il `TODO 2` in `src/retry.ts`: la funzione `withRetry`.
2. Completa il `TODO 3` in `src/catalog-client.ts`: usa `withRetry` in `getProduct`. Perché **non** in `reserve`?

### Parte 4: circuit breaker (25')

Completa il `TODO 4` in `src/catalog-client.ts` con [opossum](https://nodeshift.dev/opossum/). Quando `npm test` è tutto verde, ricostruisci e ripeti l'esperimento:

```bash
docker compose up --build -d
docker compose pause catalog
```

Crea quattro ordini di fila e guarda i tempi. Poi `GET http://localhost:8080/health/orders`: in che stato è il circuito? Dopo `docker compose unpause catalog`, quanto tempo passa prima che gli ordini tornino a funzionare?

### Parte 5: correlation ID e log (15')

1. Completa i `TODO 5` in `gateway/nginx.conf`, poi `docker compose restart gateway`.
2. Crea un ordine e copia l'header `x-request-id` della risposta.
3. Cerca quell'ID nei log di tutti i servizi:

```bash
docker compose logs | grep <id>
```

4. Prova i log a un altro livello: `LOG_LEVEL=warn docker compose up -d`. Cosa sparisce?

### Esperimenti con il "chaos"

catalog legge due variabili per diventare lento o inaffidabile. Si cambiano ricreando solo catalog:

```bash
CHAOS_DELAY_MS=3000 docker compose up -d catalog       # ogni risposta arriva dopo 3 secondi
CHAOS_FAIL_PERCENT=30 docker compose up -d catalog     # il 30% delle risposte è un 503
docker compose up -d catalog                           # torna normale
```

Con `CHAOS_FAIL_PERCENT=30`, quanti ordini falliscono? E quante letture di prodotti? Perché sono diversi?

### Checkpoint

| Verifica | Esito atteso |
|---|---|
| `npm test` in `services/orders` | pass 31, fail 0 |
| `docker compose ps` | quattro servizi `healthy` |
| ordine con catalog in pausa | 503 dopo circa 6 secondi, `"reason": "timeout"` |
| ordini successivi | 503 subito, `"reason": "circuit_open"`, header `Retry-After` |
| `GET /health/orders` | `"circuit": "open"`, poi di nuovo `"closed"` |
| `docker compose logs \| grep <id>` | lo stesso ID nel gateway, in orders e in catalog |

### Le variabili di configurazione di orders

| Variabile | Default | Significato |
|---|---|---|
| `CATALOG_URL` | `http://localhost:3001` | dove trovare catalog |
| `CATALOG_TIMEOUT_MS` | 2000 | attesa massima di una risposta |
| `CATALOG_RETRIES` | 2 | tentativi in più per le letture |
| `CATALOG_RETRY_BASE_MS` | 100 | attesa di base tra i tentativi |
| `BREAKER_ERROR_PERCENT` | 50 | % di errori che apre il circuito |
| `BREAKER_MIN_CALLS` | 5 | chiamate minime prima di giudicare |
| `BREAKER_RESET_MS` | 10000 | dopo quanto provare a richiudere |
| `BREAKER_WINDOW_MS` | 30000 | finestra in cui si contano gli errori |
| `LOG_LEVEL` | info | debug, info, warn, error |

Si cambiano senza toccare il codice, per esempio `CATALOG_TIMEOUT_MS=500 docker compose up -d orders`. Un valore sbagliato (`CATALOG_TIMEOUT_MS=abc`) blocca l'avvio con un messaggio chiaro: provalo con `docker compose logs orders`.

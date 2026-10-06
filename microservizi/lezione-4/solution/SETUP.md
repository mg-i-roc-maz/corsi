# Setup per la lezione 4

Da fare **prima** della lezione. Tempo stimato: 5 minuti.

## 1. Aggiorna il repo

```bash
cd corsi
git pull
cd microservizi/lezione-3/start
docker compose down
cd ../../lezione-4/start
code .
```

Il progetto Compose si chiama `shop` in tutte le lezioni: si ferma prima quello della lezione 3. Il volume con i prodotti resta.

## 2. Controlla che parta

```bash
docker compose up --build -d
docker compose ps
```

Dopo qualche secondo tutti e quattro i servizi devono essere `healthy`. Apri `http/shop.http` e invia `GET http://localhost:8080/health/orders`.

## 3. Installa le dipendenze di orders

Nuova dipendenza: `opossum`, la libreria del circuit breaker.

```bash
cd services/orders
npm install
```

## Problemi frequenti

| Problema | Soluzione |
|---|---|
| Un servizio resta `unhealthy` | `docker compose logs <servizio>`: spesso è un errore di configurazione |
| orders non parte: `Configurazione non valida` | Una variabile ha un valore sbagliato: il messaggio dice quale |
| Dopo `docker compose pause` niente risponde più | Ricordati `docker compose unpause catalog` |
| Il chaos resta attivo | `docker compose up -d catalog` senza variabili lo riporta normale |

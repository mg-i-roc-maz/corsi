# Setup per la lezione 6

Da fare **prima** della lezione. Tempo stimato: 5 minuti.

## 1. Aggiorna il repo

```bash
cd corsi
git pull
cd microservizi/lezione-5/start
docker compose down
cd ../../lezione-6/start
code .
```

Il progetto Compose si chiama `shop` in tutte le lezioni: si ferma prima quello della lezione 5. Il volume con i prodotti resta.

## 2. Scarica l'immagine di k6

```bash
docker pull grafana/k6:1.0.0
```

k6 non si installa sul computer: gira in un container, nella rete del Compose.

## 3. Controlla che parta

```bash
docker compose up --build -d
docker compose ps
./scripts/misura.sh
docker compose run --rm k6 run -e DURATION=5s /scripts/carico.js
```

`misura.sh` deve stampare dieci tempi; k6 deve finire con `checks_succeeded 100.00%`. Su Windows usa Git Bash per gli script.

## 4. Installa le dipendenze

Nuova dipendenza in orders: `redis`.

```bash
cd services/catalog && npm install
cd ../orders && npm install
```

## Problemi frequenti

| Problema | Soluzione |
|---|---|
| `service "k6" ... profile` o k6 non trovato | Usa `docker compose run --rm k6 ...`: k6 ha il profilo `strumenti`, non parte con `up` |
| k6: `dial tcp: lookup gateway` | Il negozio non è avviato: `docker compose up -d` prima di k6 |
| `X-Gateway-Cache` non compare | Il `TODO 2` non è fatto, oppure manca `docker compose restart gateway` |
| Sempre `MISS` nel gateway | catalog non manda `Cache-Control`: il `TODO 1` non è fatto, o catalog non è stato ricostruito |
| Il prezzo nuovo non si vede dal gateway | Normale per `HTTP_MAX_AGE_SECONDS` secondi: nginx open source non ha un comando per cancellare una copia |
| `./scripts/stampede.sh: Permission denied` | `chmod +x scripts/*.sh`, oppure `bash scripts/stampede.sh` |

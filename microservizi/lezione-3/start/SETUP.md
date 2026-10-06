# Setup per la lezione 3

Da fare **prima** della lezione. Tempo stimato: 5 minuti.

## 1. Aggiorna il repo

```bash
cd corsi
git pull
cd microservizi/lezione-3/start
code .
```

## 2. Controlla Docker

Docker Desktop deve essere avviato. Dal terminale del computer, nella cartella `lezione-3/start`:

```bash
docker compose version
docker pull nginx:1.28
```

Se nella lezione 2 hai già scaricato `node:22-slim` e `postgres:16`, oggi serve solo `nginx:1.28`.

## 3. Ferma il negozio della lezione 2

Il progetto Compose si chiama `shop` in entrambe le lezioni. Dalla cartella `lezione-2/start`:

```bash
docker compose down
```

Il volume con i prodotti resta: la lezione 3 lo ritrova. Per ripartire dai tre prodotti iniziali usa `docker compose down -v`.

## Problemi frequenti

| Problema | Soluzione |
|---|---|
| `port is already allocated` sulla 8080 | Qualcos'altro usa la 8080: fermalo, oppure in `compose.yaml` usa `"8081:80"` |
| `host not found in upstream "catalog"` nei log del gateway | Il nome in `nginx.conf` non corrisponde a quello in `compose.yaml`, o catalog non è partito |
| `502` dal gateway | Il gateway non raggiunge il servizio: `docker compose ps` e `docker compose logs catalog` |
| Modifico `nginx.conf` e non cambia niente | Il gateway legge la configurazione all'avvio: `docker compose restart gateway` |

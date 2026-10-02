# Corso: Microservizi, Caching ed Event-Driven

Repo del progetto fil rouge: un mini e-commerce che cresce lezione dopo lezione.

## Dove si trova il materiale

Tutto il corso è nel repo [corsi](https://github.com/mg-i-roc-maz/corsi), nella cartella `microservizi/`.

| Cartella | Contenuto |
|---|---|
| `lezione-2/start` | Punto di partenza della lezione 2: si lavora qui |
| `lezione-2/solution` | Soluzione completa della lezione 2 |
| `lezione-2/extra` | Esercizi extra e soluzioni |

## Struttura

```
services/catalog/    gestisce i prodotti, salvati su PostgreSQL (porta 3001)
services/orders/     riceve gli ordini, per ora in memoria (porta 3002)
compose.yaml         tutto il negozio: database + servizi
compose.debug.yaml   aggiunte per il debug da VS Code
http/                richieste pronte per l'estensione REST Client
```

## Lezione 2: Docker e Docker Compose

Prima di iniziare segui [SETUP.md](SETUP.md).

> **Dove lancio i comandi `docker`?** Nel terminale del tuo computer (Terminale su Mac, PowerShell su Windows), dalla cartella `lezione-2/start`. Il Dev Container non ha Docker al suo interno: puoi continuare a usarlo per scrivere il codice e lanciare `npm test`.

### Parte 1: primi passi con Docker (20')

```bash
docker run hello-world
docker run -d --name web -p 8080:80 nginx   # apri http://localhost:8080
docker ps
docker logs web
docker exec -it web sh                      # sei dentro il container; esci con exit
docker stop web && docker rm web
docker images
```

### Parte 2: il Dockerfile di catalog (35')

1. Completa `services/catalog/.dockerignore` e `services/catalog/Dockerfile` seguendo i `TODO`.
2. Costruisci l'immagine e avviala. Senza `DATABASE_URL` il servizio usa la memoria:

```bash
docker build -t shop-catalog ./services/catalog
docker run --rm -p 3001:3001 shop-catalog
```

3. Prova `http/catalog.http`, poi ferma il container con `Ctrl+C`.
4. Modifica una riga in `src/` e ricostruisci: quali passi escono `CACHED`? Ora modifica `package.json`: cosa cambia?
5. Guarda la dimensione con `docker images shop-catalog`.

### Parte 3: catalog + PostgreSQL con Compose (40')

1. Completa `compose.yaml` seguendo i `TODO` della Parte 3.
2. Avvia tutto:

```bash
docker compose up --build
```

3. Da un secondo terminale:

```bash
docker compose ps                         # catalog-db deve essere "healthy"
docker compose logs catalog               # deve dire "Archivio prodotti: PostgreSQL"
docker compose exec catalog-db psql -U shop -d catalog -c "SELECT * FROM products;"
```

4. Crea un prodotto con `http/catalog.http`, poi `docker compose down` e di nuovo `docker compose up`: il prodotto c'è ancora?
5. Ora `docker compose down -v`, poi `up`: cosa è successo, e perché?

### Parte 4: orders diventa un servizio (25')

1. Leggi `services/orders/src/routes.ts`: dove sono finite le tre CUCITURE del monolite?
2. Scrivi `services/orders/Dockerfile` partendo da quello di catalog.
3. Aggiungi il servizio `orders` in `compose.yaml` (porta 3002).
4. `docker compose up --build`, poi prova `http/orders.http`.

### Parte 5: debug dei container da VS Code (15')

```bash
docker compose -f compose.yaml -f compose.debug.yaml up --build
```

In VS Code: **Run and Debug** → `Debug catalog (Docker)` (dal Dev Container: `Debug catalog (Docker, da Dev Container)`). Metti un breakpoint in `services/catalog/src/routes.ts` dentro `GET /products/:id` e invia la richiesta.

### Checkpoint

| Verifica | Esito atteso |
|---|---|
| `docker compose ps` | tre servizi `running`, catalog-db `healthy` |
| `GET http://localhost:3001/products` | i tre prodotti iniziali, letti da PostgreSQL |
| `POST http://localhost:3002/orders` | 201, ordine con `"status": "pending"` |
| `docker compose down` e poi `up` | i prodotti creati sono ancora lì |
| `docker compose stop catalog` | nei log: `SIGTERM ricevuto, chiudo il server` |

### Test

I test girano anche senza Docker, con l'archivio in memoria:

```bash
cd services/catalog && npm install && npm test
cd services/orders && npm install && npm test
```

Con il database di Compose acceso partono anche i test su PostgreSQL:

```bash
cd services/catalog
DATABASE_URL=postgres://shop:shop@localhost:5432/catalog npm test
```

### Comandi utili

| Comando | A cosa serve |
|---|---|
| `docker compose up --build -d` | avvia in background ricostruendo le immagini |
| `docker compose logs -f catalog` | segue i log di un servizio |
| `docker compose exec catalog sh` | apre una shell nel container |
| `docker compose down` | ferma e rimuove i container, **tiene** i volumi |
| `docker compose down -v` | rimuove anche i volumi: database da zero |
| `docker system df` | quanto spazio occupa Docker |

# Setup per la lezione 5

Da fare **prima** della lezione. Tempo stimato: 5 minuti.

## 1. Aggiorna il repo

```bash
cd corsi
git pull
cd microservizi/lezione-4/start
docker compose down
cd ../../lezione-5/start
code .
```

Il progetto Compose si chiama `shop` in tutte le lezioni: si ferma prima quello della lezione 4. Il volume con i prodotti resta.

## 2. Scarica l'immagine di Redis

```bash
docker pull redis:7.4
```

## 3. Controlla che parta

```bash
docker compose up --build -d
docker compose ps
```

Dopo qualche secondo i servizi devono essere `healthy`. Poi:

```bash
./scripts/misura.sh
```

Deve stampare dieci tempi di circa 100 ms. Su Windows usa Git Bash, oppure `http/shop.http`.

## 4. Installa le dipendenze di catalog

Nuova dipendenza: `redis`, il client ufficiale per Node.

```bash
cd services/catalog
npm install
```

## Problemi frequenti

| Problema | Soluzione |
|---|---|
| `./scripts/misura.sh: Permission denied` | `chmod +x scripts/misura.sh`, oppure `bash scripts/misura.sh` |
| `X-Cache` non compare | Stai leggendo la lista: l'header c'è solo su `GET /products/:id` |
| Sempre `MISS` | Il TTL è troppo corto, o la cache non salva: guarda `docker compose logs catalog` |
| Il prezzo cambiato non si vede | La copia in cache non è stata invalidata: aspetta il TTL o `DEL product:<id>` in redis-cli |

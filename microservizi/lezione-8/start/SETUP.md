# Setup per la lezione 8

Da fare **prima** della lezione. Tempo stimato: 5 minuti.

## 1. Aggiorna il repo e azzera i volumi

```bash
cd corsi
git pull
cd microservizi/lezione-7/start
docker compose down -v
cd ../../lezione-8/start
code .
```

Questa volta `-v`: cancella anche i volumi. Serve per due motivi:

- la coda `notifications.order-created` della lezione 7 non ha gli argomenti della DLQ, e RabbitMQ non permette di cambiarli;
- il nuovo database `orders-db` si crea da `services/orders/db/init.sql` solo a volume vuoto.

I prodotti di catalog tornano quelli iniziali: è normale.

## 2. Installa le dipendenze

Nuove dipendenze: `pg` in orders (il suo database), `redis` in notifications (i doppioni).

```bash
cd services/orders && npm install
cd ../notifications && npm install
```

## 3. Controlla che parta

```bash
docker compose up --build -d
docker compose ps
```

Dopo qualche secondo tutti i servizi devono essere `healthy` (k6 non parte: ha il profilo `strumenti`).

## Problemi frequenti

| Problema | Soluzione |
|---|---|
| `PRECONDITION_FAILED - inequivalent arg 'x-dead-letter-exchange'` | La coda esiste già senza DLQ: cancellala dalla Management UI (Queues › la coda › Delete), o `docker compose down -v` |
| orders `unhealthy`, nei log `database di orders non raggiungibile` | `orders-db` non è partito o non ha le tabelle: `docker compose down -v` e di nuovo `up` |
| `port is already allocated` sulla 5433 | Un altro PostgreSQL usa la porta: togli `5433:5432` da `orders-db` |
| Gli script dicono `curl: (7)` sulla 15672 | RabbitMQ non è ancora pronto: aspetta `healthy` |
| Nessuna email dopo un ordine | Prima del `TODO 4` l'evento non viene scritto nell'outbox: è normale |
| `ordini.sh` risponde 409 (scorte insufficienti) | Gli esperimenti consumano le scorte di p-2: rimettile con una `PUT` da `http/shop.http`, o `docker compose down -v` |

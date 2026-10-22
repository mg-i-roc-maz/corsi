# Setup per la lezione 7

Da fare **prima** della lezione. Tempo stimato: 5 minuti.

## 1. Aggiorna il repo

```bash
cd corsi
git pull
cd microservizi/lezione-6/start
docker compose down
cd ../../lezione-7/start
code .
```

Il progetto Compose si chiama `shop` in tutte le lezioni: si ferma prima quello della lezione 6.

## 2. Scarica l'immagine di RabbitMQ

```bash
docker pull rabbitmq:4.1-management
```

## 3. Installa le dipendenze

Nuova dipendenza in orders e nel nuovo servizio notifications: `amqplib`, il client AMQP per Node.

```bash
cd services/orders && npm install
cd ../notifications && npm install
```

## 4. Controlla che parta

```bash
docker compose up --build -d
docker compose ps
```

Dopo qualche secondo catalog, orders, notifications e gateway devono essere `healthy`. RabbitMQ lo aggiungi tu nella Parte 1.

## Problemi frequenti

| Problema | Soluzione |
|---|---|
| `service "orders" depends on undefined service "rabbitmq"` | Hai tolto il commento ai `depends_on` prima di scrivere il servizio `rabbitmq` |
| La Management UI non si apre | RabbitMQ impiega 10–20 secondi a partire: `docker compose ps` finché non è `healthy` |
| `port is already allocated` sulla 5672 o 15672 | Un altro RabbitMQ è acceso sul computer: fermalo, o togli la porta 5672 dal Compose |
| `nessuna coda per questo evento` nei log di orders | Normale prima della Parte 3: nessuno ha ancora dichiarato la coda |
| La coda c'è ma i messaggi restano `Unacked` | Manca l'`ack` (TODO 5): il messaggio è consegnato ma non confermato |
| Dopo `docker compose down -v` code e messaggi spariti | `-v` cancella anche il volume `rabbitmq-data` |
| `ordini.sh` risponde 409 (scorte insufficienti) | Gli esperimenti consumano le scorte di p-2: rimettile con una `PUT` da `http/shop.http`, o `docker compose down -v` |

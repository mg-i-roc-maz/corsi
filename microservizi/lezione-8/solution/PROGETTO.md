# Progetto finale e demo

Gli ultimi 30 minuti della lezione 8 sono per le demo dei gruppi. Ogni gruppo mostra il **suo** negozio funzionante e racconta una scelta che ha fatto.

## Cosa deve funzionare

Si parte da `lezione-8/solution` (o dalla propria `start` completata). Con un solo `docker compose up --build -d`:

- `./scripts/giro-completo.sh` stampa sette `OK`;
- il gateway è l'unico ingresso (`localhost:8080`);
- un ordine produce un'email in `/api/v1/notifications`.

## Cosa aggiungere

Ogni gruppo sceglie **una** estensione e la porta fino in fondo, con test. Idee, in ordine di difficoltà:

| Estensione | Da dove partire | Servizi coinvolti |
|---|---|---|
| Un nuovo ascoltatore di `OrderCreated` (statistiche vendite, magazzino) | lezione 7, extra 1 | un servizio nuovo |
| `ProductChanged` su RabbitMQ al posto di Redis Pub/Sub | lezione 7, extra 2 | catalog, orders |
| `OrderCreated` versione 2, con un rilascio che non rompe niente | lezione 7, extra 3 | orders, notifications |
| Rimettere in coda i messaggi della DLQ dopo una correzione | lezione 8, extra 2 | notifications |
| Due copie di orders senza eventi doppi | lezione 8, extra 3 | orders |
| Annullare un ordine e restituire le scorte | lezione 8, extra 4 | orders, catalog, notifications |
| Un pagamento finto e una Saga con compensazione | lezione 8, extra 5 | orders, catalog, un servizio nuovo |

## La demo: 5 minuti per gruppo

1. **Il sistema (1')** — `docker compose ps` e `./scripts/giro-completo.sh`.
2. **L'estensione (2')** — cosa avete aggiunto, una richiesta dal vivo, i test che passano.
3. **Un guasto dal vivo (1')** — fermate un pezzo (`docker compose stop ...`) e mostrate che il sistema regge: cosa vede il cliente, cosa succede quando il pezzo riparte.
4. **Una scelta (1')** — una decisione che avete preso e cosa avete scartato. Esempi: sincrono o evento? Quanto TTL? Cosa succede se un messaggio arriva due volte?

## Domande da prepararsi

Le domande che arriveranno, di solito:

- Se questo servizio si spegne, cosa smette di funzionare? Cosa invece continua?
- Questo messaggio può arrivare due volte? Cosa succede se succede?
- Questo dato può essere vecchio? Di quanto, al massimo?
- Dove guardereste per capire un problema in produzione? (log, correlation ID, code, `/stats`)

## Consegna

Un repository (o una cartella zip) con:

- il codice, che parte con `docker compose up --build -d`;
- un `README.md` breve: cosa avete aggiunto, come provarlo, la scelta che racconterete;
- `npm test` verde in ogni servizio.

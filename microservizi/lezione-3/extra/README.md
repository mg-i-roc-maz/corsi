# Lezione 3 · Esercizi extra

Per chi finisce prima o vuole approfondire a casa. Si parte dalla propria cartella `lezione-3/start` completata. Le soluzioni sono in [`soluzione/`](soluzione/), con la stessa struttura di cartelle del progetto: ogni file sostituisce quello omonimo.

Per gli esercizi 1, 2 e 4 ci sono test pronti:

```bash
cp ../extra/catalog.extra.test.ts services/catalog/test/extra.test.ts
cp ../extra/orders.extra.test.ts  services/orders/test/extra.test.ts
```

I test di orders usano un catalog finto più completo: copia anche `soluzione/services/orders/test/fake-catalog.ts`. Finché non hai scritto il codice, `npm run typecheck` segnala i metodi mancanti: è normale.

## 1. Compensazione (medio, 30')

Oggi, se un ordine ha due righe e la seconda non ha scorte, la prima resta prenotata: quei pezzi spariscono dal magazzino. Sistemalo.

1. In catalog aggiungi `POST /products/:id/releases` con corpo `{ "quantity": n }`: rimette `n` pezzi nelle scorte. 200 con il prodotto, 404 se non esiste.
2. In `catalog-client.ts` aggiungi `release(id, quantity)`.
3. In `POST /orders`, quando una prenotazione fallisce, rilascia quelle già fatte, poi rispondi 409.
4. Nel gateway blocca anche `/releases`: è una rotta interna.

Domanda: e se catalog si spegne proprio tra la prenotazione e il rilascio? Cosa resta nel magazzino? Come potresti accorgertene?

## 2. Una chiamata invece di N (medio, 20')

Un ordine con 10 righe fa 10 chiamate `GET /products/:id`, una dopo l'altra: 10 volte la latenza di rete.

1. In catalog, `GET /products?ids=p-1,p-2` restituisce solo quei prodotti.
2. In `catalog-client.ts` aggiungi `getProducts(ids)` e usalo in `POST /orders` al posto di `getProduct`.

Domanda: le prenotazioni restano una per riga. Come le ridurresti a una sola chiamata, e cosa diventerebbe più semplice?

## 3. Limitare le richieste nel gateway (base, 15')

Proteggi orders dai clienti troppo insistenti: al massimo 5 richieste al secondo per indirizzo IP, poi `429 Too Many Requests`.

Nginx lo fa con due direttive: `limit_req_zone` (nel blocco `http`) e `limit_req` (nella `location` degli ordini). Per provarlo:

```bash
for i in $(seq 1 15); do curl -s -o /dev/null -w "%{http_code} " http://localhost:8080/api/v1/orders; done
```

Domanda: perché è meglio farlo nel gateway che in ogni servizio?

## 4. Una versione 2 dell'API (avanzato, 25')

Il team del sito vuole il prezzo in euro, non in centesimi: `"price": { "amount": 89.9, "currency": "EUR" }`. Cambiare `priceCents` romperebbe orders e tutti i client esistenti.

1. In catalog aggiungi `GET /v2/products/:id` con il nuovo formato e il campo `available` (vero se ci sono scorte).
2. Nel gateway esponi `/api/v2/products` verso `/v2/products` di catalog.
3. Verifica che `/api/v1/products/p-1` sia rimasto identico.

Domanda: aggiungere un campo nuovo alla v1 (per esempio `category`) richiederebbe una v2? E togliere `description`?

## 5. Progetta le API di notifications (carta e penna, 20')

Nella lezione 7 arriverà il servizio `notifications`, che manda le email di conferma.

1. Scrivi le rotte REST che esporrebbe: metodo, percorso, corpo, codici di risposta.
2. Quali dati gli servono di un ordine? Li chiede a orders o li riceve?
3. Se orders lo chiamasse via HTTP dopo aver creato l'ordine, cosa succederebbe con notifications spento? È accettabile?

Tienilo da parte: lo riprendiamo nella lezione 7.

## Soluzioni

| File in `soluzione/` | Esercizi |
|---|---|
| `services/catalog/src/routes.ts` e `src/store/*.ts` | 1, 2, 4 |
| `services/orders/src/catalog-client.ts` e `src/routes.ts` | 1, 2 |
| `gateway/nginx.conf` | 1, 3, 4 |
| `services/*/test/extra.test.ts`, `services/orders/test/fake-catalog.ts` | test |

Esercizio 5, una traccia di risposta: `POST /notifications` con `{ "orderId", "customerEmail", "totalCents" }`, risposta `202 Accepted` perché l'invio dell'email avviene dopo. Le serve solo quello che c'è nell'ordine, quindi conviene riceverlo invece di richiederlo. Con una chiamata sincrona, se notifications è spento orders deve scegliere tra fallire l'ordine (inaccettabile per una email) o perdere la notifica: è il problema che risolve un evento su una coda, nella lezione 7.

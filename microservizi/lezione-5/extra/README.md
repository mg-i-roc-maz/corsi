# Lezione 5 · Esercizi extra

Per chi finisce prima o vuole approfondire a casa. Si parte dalla propria cartella `lezione-5/start` completata. Le soluzioni sono in [`soluzione/`](soluzione/), con la stessa struttura del progetto: ogni file sostituisce quello omonimo.

Per gli esercizi 1-4 ci sono test pronti:

```bash
cp ../extra/catalog.extra.test.ts services/catalog/test/extra.test.ts
```

Finché non hai scritto il codice, `npm run typecheck` segnala le opzioni e i metodi mancanti: è normale.

Per provare con Docker, aggiungi le nuove variabili all'`environment` di catalog in `compose.yaml` e riavvia con `docker compose up -d --build catalog`.

## 1. Ricordarsi di ciò che non esiste (base, 15')

Chiedi venti volte `GET /api/v1/products/p-999`: ogni richiesta arriva al database, perché un 404 non finisce in cache. Se qualcuno (o un bot) chiede in continuazione id che non esistono, la cache non lo protegge.

- In `product-cache.ts` aggiungi l'opzione `negativeTtlSeconds` (default 0 = spento).
- Se il prodotto non esiste, salva in cache un valore speciale, per esempio `"__non_esiste__"`, con quel TTL.
- In lettura, se trovi quel valore, rispondi "non esiste" con `X-Cache: HIT`.
- Variabile d'ambiente: `CACHE_NEGATIVE_TTL_SECONDS`.

Domanda: perché il TTL negativo deve essere molto più corto di quello normale? Cosa succede se un prodotto viene creato proprio con quell'id?

## 2. Scadenze sparse (base, 15')

Al mattino un job scalda la cache: legge tutti i prodotti alle 8:00:00. Con TTL 60, alle 8:01:00 scadono tutti insieme, e il database riceve di colpo tutte le letture.

- Aggiungi l'opzione `ttlJitterPercent`: con 10, il TTL diventa un valore casuale tra 54 e 66 secondi.
- Per i test, passa anche `random` (default `Math.random`).
- Variabile d'ambiente: `CACHE_TTL_JITTER_PERCENT`.

Verifica: leggi p-1, p-2 e p-3 e guarda i TTL con `docker compose exec redis redis-cli TTL product:p-1` (e gli altri). Ricorda il grafico del jitter della lezione 4: è la stessa idea.

## 3. La lista in cache (medio, 20')

`GET /products` senza ricerca è la pagina più vista del negozio, e oggi va sempre al database.

- Metti in cache la lista completa sotto una sola chiave, `products:all`, con header `X-Cache`.
- Le ricerche (`?q=...`) non passano dalla cache: perché?
- Quando va buttata la lista? Pensa a creazione, modifica, cancellazione e prenotazione.

Domanda: con mille prodotti e una modifica al secondo, quanto serve questa cache? Cosa cambieresti?

## 4. Write-through (medio, 20')

Oggi una `PUT` cancella la copia e la lettura successiva è un MISS. Con il **write-through** la `PUT` scrive il valore nuovo anche in cache: la lettura successiva è subito un HIT.

- Aggiungi a `product-cache.ts` un metodo `write(product)` che salva il prodotto in cache.
- Usalo nella `PUT` al posto di `invalidate`.
- Se la scrittura in cache fallisce, cosa devi fare con la copia vecchia?

Nota: il test principale "PUT invalida la cache" accetta sia MISS sia HIT, quindi passa con entrambe le versioni.

Domanda: perché per le prenotazioni conviene comunque l'invalidazione? (Suggerimento: chi conosce il valore nuovo delle scorte?)

## 5. Cosa mettere in cache nel negozio (carta e penna, 15')

Per ogni dato scegli: in cache sì o no, TTL, come si invalida, cosa succede se il dato è vecchio.

| Dato | Cache? | TTL | Invalidazione | Rischio se vecchio |
|---|---|---|---|---|
| Nome e descrizione di un prodotto | | | | |
| Prezzo di un prodotto | | | | |
| Scorte di un prodotto | | | | |
| Lista delle categorie | | | | |
| Risultati di una ricerca | | | | |
| Stato di un ordine | | | | |
| Carrello di un cliente | | | | |

## Soluzioni

| File in `soluzione/` | Esercizi |
|---|---|
| `services/catalog/src/product-cache.ts` | 1, 2, 3, 4 |
| `services/catalog/src/routes.ts` | 3, 4 |
| `services/catalog/src/app.ts`, `server.ts` | 1, 2 |
| `services/catalog/test/extra.test.ts` | test |

Esercizio 1: un TTL negativo lungo nasconderebbe un prodotto appena creato. In questo progetto gli id li genera catalog, quindi il rischio è basso; se gli id arrivassero da fuori, la creazione dovrebbe cancellare anche la chiave del prodotto.

Esercizio 3: le ricerche hanno infinite combinazioni, quindi pochi HIT e molta memoria. La lista va buttata a ogni scrittura: con molte scritture il hit ratio crolla. Alternative: TTL breve (anche 5 secondi aiutano molto con tanto traffico), oppure una pagina alla volta.

Esercizio 4: se la scrittura in cache fallisce, si prova a cancellare la chiave; altrimenti resta il valore vecchio fino al TTL. Per le prenotazioni il valore nuovo delle scorte lo calcola il database in modo atomico: catalog dovrebbe rileggerlo, e tanto vale invalidare.

Esercizio 5, traccia. Nome e descrizione: sì, TTL lungo (ore), invalidazione a ogni modifica. Prezzo: sì, ma TTL breve e invalidazione, perché un prezzo vecchio al checkout è un problema: il prezzo finale lo legge orders al momento dell'ordine. Scorte: si possono mostrare dalla cache ("disponibile"), ma la prenotazione va sempre al database. Categorie: sì, TTL lungo, cambiano di rado. Ricerche: al massimo pochi secondi, solo le più frequenti. Stato dell'ordine: meglio di no, il cliente vuole il dato vero. Carrello: non è una cache, è un dato del cliente; in Redis si può tenere, ma con persistenza e come archivio principale, non come copia.

# Corso: Microservizi, Caching ed Event-Driven

Repo del progetto fil rouge: un mini e-commerce che cresce lezione dopo lezione.

## Dove si trova il materiale

Tutto il corso è nel repo [corsi](https://github.com/mg-i-roc-maz/corsi), nella cartella `microservizi/`. Ogni lezione ha due cartelle:

| Cartella | Contenuto |
|---|---|
| `lezione-1/start` | Punto di partenza della lezione 1 |
| `lezione-1/solution` | Soluzione completa della lezione 1 |

Si lavora sempre nella cartella `start`. Se resti indietro, confronta il tuo codice con quello di `solution`, oppure copia da lì i file che ti servono.

## Struttura

```
monolith/            il negozio come monolite: catalogo + ordini in un solo processo (porta 3000)
services/catalog/    il primo microservizio: gestisce i prodotti (porta 3001)
http/                richieste pronte per l'estensione REST Client
.devcontainer/       ambiente di sviluppo già configurato
```

## Lezione 1: dal monolite ai microservizi

Prima di iniziare segui [SETUP.md](SETUP.md).

### Parte 1: esplora il monolite (30')

```bash
cd monolith
npm install
npm run dev
```

1. Apri `http/monolith.http` e invia le richieste una alla volta.
2. Crea un ordine, poi rileggi i prodotti: le scorte sono cambiate.
3. Apri `monolith/src/orders/routes.ts` e trova i tre commenti `CUCITURA`.
4. Per ognuno rispondi: *se catalogo e ordini fossero due programmi separati, come farebbe questo codice a funzionare?*

### Parte 2: costruisci il servizio catalog (50')

```bash
cd services/catalog
npm install
npm run dev     # il servizio si riavvia da solo a ogni salvataggio
```

Il file da completare è `services/catalog/src/routes.ts`. `GET /products` funziona già: completa le altre rotte seguendo i `TODO`.

| Rotta | Esito atteso |
|---|---|
| `GET /products/:id` | 200 con il prodotto, 404 se non esiste |
| `POST /products` | 201 con header `Location`, 400 se i dati non sono validi |
| `PUT /products/:id` | 200 con il prodotto aggiornato, 404 se non esiste |
| `DELETE /products/:id` | 204, 404 se non esiste |

Prova le rotte con `http/catalog.http`.

### Checkpoint (15')

```bash
cd services/catalog
npm test
```

La consegna è completa quando tutti i test sono verdi.

### Cosa si rompe se...? (10')

- ...il modulo ordini ha un bug che manda in crash il processo del monolite?
- ...domani il catalogo diventa un servizio separato, ma gli ordini continuano a modificare le scorte direttamente?
- ...due persone ordinano l'ultimo monitor nello stesso istante?

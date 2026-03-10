---
marp: true
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
style: |
  html, body, section, .marp-slide, .marp-slide * {
    font-size: 2.1em !important;
  }
---

# Tecnologie web per Data Analyst

## Introduzione al corso, architettura client-server

```js
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

# Architetture RESTful

## Cos'è REST?

- **REST** (Representational State Transfer) è uno stile architetturale per la progettazione di servizi web.
- Basato su principi come:
  - Statelessness (assenza di stato lato server)
  - Uniform Interface (interfaccia uniforme)
  - Client-Server separation (separazione client-server)
  - Cacheability (possibilità di caching)
- Utilizza protocolli standard, tipicamente HTTP.

---

## Principi RESTful

- **Risorse** identificate da URI (Uniform Resource Identifier)
- Operazioni standard: **GET**, **POST**, **PUT**, **DELETE**
- Comunicazione tramite rappresentazioni (tipicamente JSON o XML)
- Stateless: ogni richiesta contiene tutte le informazioni necessarie

---

## Esempio di Endpoints REST

| Metodo | Endpoint         | Descrizione           |
|--------|-----------------|-----------------------|
| GET    | /utenti         | Elenca tutti gli utenti |
| GET    | /utenti/123     | Ottieni utente 123    |
| POST   | /utenti         | Crea un nuovo utente  |
| PUT    | /utenti/123     | Aggiorna utente 123   |
| DELETE | /utenti/123     | Elimina utente 123    |

---

# Scambio di dati: JSON

## Cos'è JSON?

- **JSON** (JavaScript Object Notation) è un formato leggero per lo scambio di dati
- Facile da leggere e scrivere per umani e macchine
- Basato su coppie chiave/valore

---

## Esempio di oggetto JSON

```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@email.com",
  "eta": 30
}
```

---

## Vantaggi di JSON

- Sintassi semplice e compatta
- Ampio supporto nei linguaggi di programmazione
- Ideale per applicazioni web e API RESTful

---

# REST e JSON insieme

- Le API RESTful utilizzano spesso JSON per lo scambio di dati tra client e server
- Esempio di richiesta HTTP:

```http
POST /utenti HTTP/1.1
Content-Type: application/json

{
  "nome": "Luca",
  "cognome": "Bianchi"
}
```

---

## Attività pratica

- Analizza un'API REST pubblica (es. https://jsonplaceholder.typicode.com)
- Esegui richieste GET e POST usando strumenti come Postman o curl
- Osserva le risposte in   JSON

---

# Domande?

---
marp: true
---

# Introduzione a JavaScript

JavaScript è un linguaggio di programmazione nato nel 1995 per aggiungere interattività alle pagine web. Creato da Brendan Eich, è diventato uno standard del web, supportato da tutti i principali browser. JavaScript permette di manipolare il DOM, gestire eventi e comunicare con server tramite AJAX.

---

## Sintassi base di JavaScript in HTML

Per includere JavaScript in una pagina HTML, si utilizza il tag `<script>`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Esempio JavaScript</title>
  </head>
  <body>
    <h1>Ciao JavaScript!</h1>
    <script>
      document.querySelector('h1').textContent = 'Benvenuto in JavaScript!';
    </script>
  </body>
</html>
```

---

## Come funziona JavaScript nel browser

- JavaScript viene eseguito direttamente dal browser, lato client.
- Può manipolare la pagina web (DOM), rispondere agli eventi e comunicare con server.
- Ogni browser ha un motore JavaScript (es. V8 per Chrome, SpiderMonkey per Firefox).

---

## Prova pratica: Console del browser

1. Apri una pagina web qualsiasi.
2. Premi `F12` o `Ctrl+Shift+I` per aprire gli strumenti di sviluppo.
3. Vai alla scheda "Console".
4. Scrivi e esegui codice JavaScript, ad esempio:

```javascript
console.log('Ciao dal browser!');
```

---

## Inserire JavaScript in un file esterno

- È buona pratica separare il codice JavaScript dall'HTML.
- Si crea un file, ad esempio `script.js`, e lo si collega all'HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Esempio con file esterno</title>
    <script src="script.js"></script>
  </head>
  <body>
    <h1>Test JavaScript esterno</h1>
  </body>
</html>
```

- Il browser carica ed esegue il file JavaScript indicato.

---

## Sintassi base di JavaScript

- **Dichiarazione di variabili**:  
  - `var` è la parola chiave storica per dichiarare variabili. Ha ambito di funzione e può essere ridefinita.
  - Oggi si preferiscono `let` e `const` per una gestione più sicura dell'ambito delle variabili.

```javascript
var messaggio = 'Ciao!';
let nome = 'Mario';
const eta = 25;
```
---

## Scope di var, let e const

- **`var`**: ha scope di funzione. Se dichiarata dentro una funzione, è visibile solo all'interno di essa; se dichiarata fuori, è globale. Non rispetta il blocco (`if`, `for`, ecc.).
- **`let`**: ha scope di blocco. È visibile solo all'interno del blocco in cui è dichiarata (ad esempio dentro `{ ... }`).
- **`const`**: come `let`, ha scope di blocco. Il valore non può essere riassegnato, ma se è un oggetto o array, le sue proprietà possono essere modificate.

**Esempio:**

```javascript
if (true) {
  var x = 1;
  let y = 2;
  const z = 3;
}
console.log(x); // 1 (var esce dal blocco)
console.log(y); // ReferenceError
console.log(z); // ReferenceError
```

```javascript
let nome = 'Mario';
const eta = 25;
```

---
---

## Challenge 1: Dichiarazione di variabili

Scrivi del codice che dichiara una variabile `nome` usando `let` e le assegna il valore `"Luca"`. Poi prova a dichiarare di nuovo la stessa variabile nello stesso blocco. Cosa succede?

---

### Soluzione Challenge 1

```javascript
let nome = "Luca";
let nome = "Marco"; // Errore: Identifier 'nome' has already been declared
```

- **Errore:** Non puoi dichiarare due volte una variabile con `let` nello stesso blocco.

---

## Challenge 2: Uso di `var` e riassegnazione

Dichiara una variabile `x` con `var` e assegnale il valore `10`. Poi riassegna `x` a `20` e stampa il risultato.

---

### Soluzione Challenge 2

```javascript
var x = 10;
x = 20;
console.log(x); // 20
```

- Con `var` puoi riassegnare il valore della variabile.

---

## Challenge 3: Scope di blocco

Cosa succede se dichiari una variabile con `let` dentro un blocco `if` e provi ad accedervi fuori dal blocco?

---

### Soluzione Challenge 3

```javascript
if (true) {
  let y = 5;
}
console.log(y); // ReferenceError: y is not defined
```

- **Errore:** `let` ha scope di blocco, quindi `y` non è visibile fuori dall'`if`.

---

## Challenge 4: Uso di `const`

Dichiara una variabile `PI` con `const` e assegnale il valore `3.14`. Prova a cambiare il valore di `PI`. Cosa succede?

---

### Soluzione Challenge 4

```javascript
const PI = 3.14;
PI = 3.1416; // TypeError: Assignment to constant variable.
```

- **Errore:** Non puoi riassegnare una variabile dichiarata con `const`.

---

## Challenge 5: Hoisting con `var` e `let`

Cosa succede se provi a usare una variabile dichiarata con `var` o `let` prima della sua dichiarazione?

---

### Soluzione Challenge 5

```javascript
console.log(a); // undefined (hoisting con var)
var a = 10;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;
```

- Le variabili `var` vengono "hoistate" (sollevate) ma inizializzate a `undefined`.
- Le variabili `let` (e `const`) non possono essere usate prima della dichiarazione.

---
---

- **Funzioni**:

```javascript
function saluta() {
  console.log('Ciao!');
}
saluta();
```

- **Condizioni**:

```javascript
if (eta >= 18) {
  console.log('Sei maggiorenne');
} else {
  console.log('Sei minorenne');
}
```

---

## Accedere agli elementi HTML

- **Selezionare elementi**:

```javascript
// Seleziona il primo elemento con id "titolo"
const titolo = document.getElementById('titolo');

// Seleziona il primo elemento con classe "paragrafo"
const paragrafo = document.querySelector('.paragrafo');

// Seleziona tutti gli elementi <li>
const elementiLista = document.querySelectorAll('li');
```

---
## Modificare il testo e gli attributi di un elemento

- **Cambiare il testo di un elemento**:

```javascript
const titolo = document.getElementById('titolo');
titolo.textContent = 'Nuovo Titolo!';
```

- **Cambiare attributi**:

```javascript
const link = document.querySelector('a');
link.setAttribute('href', 'https://www.example.com');
```

---

## Modificare lo stile degli elementi

- **Modificare lo stile**:

```javascript
const box = document.getElementById('box');
box.style.backgroundColor = 'yellow';
box.style.fontSize = '20px';
```

---

## Aggiungere e rimuovere elementi nel DOM

- **Aggiungere un elemento figlio**:

```javascript
const lista = document.querySelector('ul');
const nuovoElemento = document.createElement('li');
nuovoElemento.textContent = 'Nuovo elemento';
lista.appendChild(nuovoElemento);
```

- **Rimuovere un elemento**:

```javascript
const elemento = document.getElementById('daRimuovere');
elemento.remove();
```

---

## Gestire eventi sugli elementi

- **Gestire eventi**:

```javascript
const bottone = document.getElementById('mioBottone');
bottone.addEventListener('click', function() {
  alert('Hai cliccato il bottone!');
});
```

---

## Iterare e modificare più elementi HTML

- **Selezionare tutti gli elementi** (ad esempio tutti i `<li>`):

```javascript
const elementi = document.querySelectorAll('li');
```

- **Ciclare su tutti gli elementi e modificarli**:

```javascript
elementi.forEach(function(elemento) {
  elemento.textContent = 'Elemento modificato!';
});
```

- Puoi anche cambiare classi, attributi o stili di ciascun elemento all'interno del ciclo.
- `forEach` funziona su NodeList (il risultato di `querySelectorAll`).

**Esempio: aggiungere una classe a tutti i paragrafi**

```javascript
const paragrafi = document.querySelectorAll('p');
paragrafi.forEach(p => p.classList.add('evidenziato'));
```
---


## Esercitazione 1: Seleziona un elemento per ID e cambia il testo

Scrivi un codice JavaScript che seleziona un elemento con `id="titolo"` e ne modifica il testo in "Titolo modificato dall'esercizio".

---

### Soluzione Esercitazione 1

```javascript
const titolo = document.getElementById('titolo');
titolo.textContent = 'Titolo modificato dall\'esercizio';
```

---

## Esercitazione 2: Cambia il contenuto dell'ultimo elemento di una lista

Data una lista di elementi `<li>`, scrivi un codice che seleziona l'ultimo elemento e ne cambia il testo in "Ultimo elemento aggiornato".

---

### Soluzione Esercitazione 2

```javascript
const elementi = document.querySelectorAll('li');
const ultimo = elementi[elementi.length - 1];
ultimo.textContent = 'Ultimo elemento aggiornato';
```

---

## Esercitazione 3: Aggiungi una classe a tutti i paragrafi

Scrivi un codice che seleziona tutti gli elementi `<p>` e aggiunge loro la classe CSS `"evidenziato"`.

---

### Soluzione Esercitazione 3

```javascript
const paragrafi = document.querySelectorAll('p');
paragrafi.forEach(p => p.classList.add('evidenziato'));
```

---

## Esercitazione 4: Cambia il colore del primo elemento con una certa classe

Seleziona il primo elemento con la classe `"paragrafo"` e cambia il suo colore del testo in rosso usando JavaScript.

---

### Soluzione Esercitazione 4

```javascript
const primoParagrafo = document.querySelector('.paragrafo');
primoParagrafo.style.color = 'red';
```


---

## Cambiare classi CSS con JavaScript

- **Aggiungere, rimuovere o alternare classi**:

```javascript
const bottone = document.querySelector('#mioBottone');

// Aggiungi una classe
bottone.classList.add('attivo');

// Rimuovi una classe
bottone.classList.remove('attivo');

// Alterna una classe (aggiunge se non c'è, rimuove se c'è)
bottone.classList.toggle('attivo');
```

---

## Modificare il contenuto degli elementi

- **Cambiare il testo**:

```javascript
const titolo = document.getElementById('titolo');
titolo.textContent = 'Nuovo titolo!';
```

- **Cambiare l'HTML interno**:

```javascript
const contenitore = document.querySelector('.contenitore');
contenitore.innerHTML = '<p>Nuovo <strong>contenuto</strong>!</p>';
```

---


1. **Introduzione ad AJAX**
  - Cos'è AJAX
  - Vantaggi e svantaggi

---

## Cos'è AJAX e cosa permette di fare

- AJAX (Asynchronous JavaScript and XML) è una tecnica che consente di inviare e ricevere dati dal server in modo asincrono, senza ricaricare la pagina.
- Permette di aggiornare parti della pagina web dinamicamente, migliorando l'esperienza utente.
- Non è un linguaggio, ma una combinazione di tecnologie: JavaScript, oggetti XMLHttpRequest o Fetch API, HTML/CSS e spesso dati in formato JSON.

---

## Approfondimento: Il formato JSON

- **JSON** (JavaScript Object Notation) è un formato leggero per lo scambio di dati, molto usato nelle comunicazioni AJAX.
- È facile da leggere e scrivere sia per le persone che per le macchine.
- In JavaScript, puoi convertire un oggetto in JSON con `JSON.stringify()` e viceversa con `JSON.parse()`.

**Esempio di oggetto JavaScript:**

```javascript
const persona = {
  nome: "Mario",
  eta: 30
};
```

**Conversione in JSON:**

```javascript
const json = JSON.stringify(persona);
// Risultato: '{"nome":"Mario","eta":30}'
```

**Parsing da JSON a oggetto:**

```javascript
const oggetto = JSON.parse(json);
// Risultato: { nome: "Mario", eta: 30 }
```

---


- JSON supporta tipi semplici: stringhe, numeri, booleani, array, oggetti e `null`.
- È il formato più usato per scambiare dati tra client e server nelle applicazioni web moderne.
- Attenzione: le chiavi e le stringhe devono essere racchiuse tra doppi apici (`"`).

---

### Esempio pratico: file `.json` e endpoint di test

**Esempio di file `dati.json`:**

```json
{
  "nome": "Anna",
  "cognome": "Rossi",
  "eta": 28,
  "hobby": ["lettura", "sport", "viaggi"]
}
```

**Come caricare un file JSON da JavaScript (con Fetch API):**

```javascript
fetch('dati.json')
  .then(response => response.json())
  .then(dati => {
    console.log('Nome:', dati.nome);
    console.log('Hobby:', dati.hobby.join(', '));
  });
```

---

### Endpoint pubblici di test per provare JSON nel browser

Puoi provare a fare richieste AJAX a questi endpoint gratuiti:

- [https://jsonplaceholder.typicode.com/users/1](https://jsonplaceholder.typicode.com/users/1)
- [https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)

**Esempio:**

```javascript
fetch('https://jsonplaceholder.typicode.com/users/1')
  .then(res => res.json())
  .then(user => {
    console.log('Nome utente:', user.name);
    console.log('Email:', user.email);
  });
```

Puoi incollare questo codice direttamente nella console del browser per vedere il risultato.

---

## Cosa si può fare con AJAX

- Caricare dati da un server e visualizzarli senza ricaricare la pagina.
- Inviare dati di un form in background.
- Aggiornare solo una sezione della pagina (es. risultati di ricerca, notifiche).
- Costruire applicazioni web interattive come chat, dashboard, mappe dinamiche.

---

## Esempio base: richiesta GET con Fetch API

```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(dati => {
    console.log('Titolo:', dati.title);
  });
```

- In questo esempio, viene richiesta una risorsa da un server e il titolo viene stampato in console.

---

## Esempio base: invio dati con POST

```javascript
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Nuovo post', body: 'Testo', userId: 1 })
})
  .then(response => response.json())
  .then(dati => {
    console.log('Risposta dal server:', dati);
  });
```

- Questo esempio mostra come inviare dati a un server e gestire la risposta.

---

2. **Struttura di una richiesta AJAX**
  - XMLHttpRequest vs Fetch API
  - Sintassi base

  ---

  ## Struttura di una richiesta AJAX

  ### XMLHttpRequest

  - È il metodo "storico" per effettuare richieste AJAX.
  - Richiede più codice e gestione manuale degli stati della richiesta.

  **Esempio base:**

  ```javascript
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1');
  xhr.onload = function() {
    if (xhr.status === 200) {
      const dati = JSON.parse(xhr.responseText);
      console.log('Titolo:', dati.title);
    }
  };
  xhr.send();
  ```

  - Bisogna gestire manualmente gli eventi come `onload`, `onerror`, ecc.

  ---

  ### Fetch API

  - Introdotta nei browser moderni, è più semplice e basata sulle Promise.
  - Sintassi più pulita e leggibile.

  **Esempio base:**

  ```javascript
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => response.json())
    .then(dati => {
      console.log('Titolo:', dati.title);
    });
  ```

  - Gestione più semplice degli errori e delle risposte asincrone.
  - Supporta anche le richieste POST, PUT, DELETE, ecc.

---

---

## Introduzione alle Promise in JavaScript

- Una **Promise** è un oggetto che rappresenta il risultato futuro di un'operazione asincrona.
- Permette di gestire codice asincrono in modo più leggibile rispetto alle callback tradizionali.
- Una Promise può essere in tre stati:
  - **pending** (in attesa)
  - **fulfilled** (risolta)
  - **rejected** (rifiutata)

---

## Sintassi base delle Promise

**Creazione di una Promise:**

```javascript
const promessa = new Promise((resolve, reject) => {
  // Operazione asincrona
  if (/* tutto ok */) {
    resolve('Risultato');
  } else {
    reject('Errore');
  }
});
```

**Utilizzo di then/catch:**

```javascript
promessa
  .then(risultato => {
    console.log('Successo:', risultato);
  })
  .catch(errore => {
    console.error('Errore:', errore);
  });
```

- Le Promise sono usate da molte API moderne, come la Fetch API.
- Permettono di concatenare operazioni asincrone in modo chiaro e gestire facilmente gli errori.

--- 

3. **Esempi pratici**
  - Richiesta GET con XMLHttpRequest
  - Richiesta GET con Fetch API
  - Invio dati con POST

4. **Gestione delle risposte**
  - Parsing JSON
  - Gestione degli errori

5. **Esercitazione 1: Visualizzare dati da una API**
  - Recupero e visualizzazione di dati in una tabella

6. **Esercitazione 2: Form con invio dati via AJAX**
  - Creazione di un form e invio dati senza ricaricare la pagina

7. **AJAX e il DOM**
  - Aggiornamento dinamico dei contenuti

8. **Best Practice e sicurezza**
  - CORS
  - Validazione dei dati

9. **Domande e approfondimenti**

> **Durata stimata:** 4 ore
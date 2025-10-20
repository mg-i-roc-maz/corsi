---
marp: true
---

<!-- Slide 1 -->

# Introduzione al CSS

Cos'è il CSS e perché è fondamentale per la progettazione web.

## Cosa fa il CSS?

Il CSS (Cascading Style Sheets) permette di separare la struttura (HTML) dalla presentazione (stili) di una pagina web. Consente di controllare colori, spaziature, layout, tipografia e molto altro.

---

## Vantaggi dell'uso del CSS

- **Manutenzione facilitata:** Modificare lo stile di più pagine cambiando un solo file CSS.
- **Consistenza:** Garantisce un aspetto uniforme su tutto il sito.
- **Accessibilità:** Migliora l'esperienza utente su diversi dispositivi e per utenti con disabilità.
- **Prestazioni:** Riduce la quantità di codice duplicato e velocizza il caricamento delle pagine.

---

## Esempio di base

```css
body {
  background-color: #f0f0f0;
  color: #333;
}
```

---

## Esercitazione: Applicare uno sfondo rosso e testo nero

Crea una semplice pagina HTML e applica uno stile CSS per avere lo sfondo rosso e il testo nero.

---

**Esempio:**

```html
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Esercitazione CSS</title>
    <style>
      body {
        background-color: red;
        color: black;
      }
    </style>
  </head>
  <body>
    <h1>Benvenuto!</h1>
    <p>Questa pagina ha uno sfondo rosso e il testo nero.</p>
  </body>
</html>
```

---

<!-- Slide 2 -->

# Sintassi di base

## Selettori, proprietà e valori: la struttura di una regola CSS.

## Struttura di una regola CSS

Una regola CSS è composta da:

- **Selettore:** indica a quali elementi HTML applicare lo stile.
- **Dichiarazione:** racchiusa tra parentesi graffe `{}` e composta da una o più coppie proprietà/valore.
- **Proprietà:** l'aspetto da modificare (es. `color`, `font-size`).
- **Valore:** il valore assegnato alla proprietà (es. `red`, `16px`).

---

**Esempio:**

```css
p {
  color: blue;
  font-size: 18px;
}
```

In questo esempio, tutti gli elementi `<p>` avranno il testo blu e una dimensione di 18px.

---

## ID e classi nell'HTML

- **ID:** Attributo che identifica un elemento in modo univoco nella pagina. Si usa per applicare stili specifici o per riferirsi all'elemento tramite JavaScript.

  ```html
  <h1 id="intestazione">Titolo principale</h1>
  ```

- **Classe:** Attributo che permette di raggruppare più elementi con lo stesso stile. Un elemento può avere più classi separate da spazi.

  ```html
  <p class="evidenziato importante">Testo evidenziato</p>
  ```

Gli ID si usano per selezionare un singolo elemento, mentre le classi servono per applicare lo stesso stile a più elementi.

---

## Proprietà CSS più utilizzate

Ecco alcune delle proprietà CSS più comuni con una breve descrizione:

- **color:** imposta il colore del testo.  
  _Esempio:_ `color: red;`, `color: #333;`, `color: rgb(0,0,0);`
- **background-color:** definisce il colore di sfondo di un elemento.  
  _Esempio:_ `background-color: yellow;`, `background-color: #f0f0f0;`
- **font-size:** specifica la dimensione del testo.  
  _Esempio:_ `font-size: 16px;`, `font-size: 1.2em;`
- **font-family:** indica il tipo di carattere da utilizzare.  
  _Esempio:_ `font-family: Arial, sans-serif;`

---

- **font-weight:** determina lo spessore del testo (es. bold).  
  _Esempio:_ `font-weight: bold;`, `font-weight: 700;`
- **text-align:** allinea il testo (sinistra, destra, centro, giustificato).  
  _Esempio:_ `text-align: center;`, `text-align: right;`
- **margin:** imposta lo spazio esterno attorno a un elemento.  
  _Esempio:_ `margin: 20px;`, `margin: 10px 5px;`
- **padding:** definisce lo spazio interno tra il bordo e il contenuto di un elemento.  
  _Esempio:_ `padding: 15px;`, `padding: 5px 10px;`
- **border:** aggiunge un bordo attorno a un elemento (spessore, stile, colore).  
  _Esempio:_ `border: 1px solid black;`, `border: 2px dashed #ccc;`
- **width / height:** specificano larghezza e altezza di un elemento.  
  _Esempio:_ `width: 100px;`, `height: 50%;`

---

- **display:** controlla il tipo di box di un elemento (block, inline, flex, ecc.).  
  _Esempio:_ `display: block;`, `display: flex;`
- **position:** definisce il metodo di posizionamento (static, relative, absolute, fixed, sticky).  
  _Esempio:_ `position: absolute;`, `position: fixed;`
- **top / right / bottom / left:** posizionano un elemento rispetto al suo contenitore.  
  _Esempio:_ `top: 10px;`, `left: 0;`
- **overflow:** gestisce il contenuto che esce dai limiti dell’elemento (visible, hidden, scroll, auto).  
  _Esempio:_ `overflow: hidden;`, `overflow: auto;`

---

- **z-index:** imposta la profondità di sovrapposizione degli elementi posizionati.  
  _Esempio:_ `z-index: 10;`
- **opacity:** regola la trasparenza dell’elemento.  
  _Esempio:_ `opacity: 0.5;`
- **box-shadow:** aggiunge un’ombra al box dell’elemento.  
  _Esempio:_ `box-shadow: 2px 2px 8px #888;`
- **text-shadow:** aggiunge un’ombra al testo.  
  _Esempio:_ `text-shadow: 1px 1px 2px gray;`

Queste proprietà sono la base per la maggior parte delle personalizzazioni CSS.

---

## Risorsa: Elenco completo delle proprietà CSS

Per consultare la lista aggiornata e ufficiale di tutte le proprietà CSS, visita la documentazione MDN:

- [Elenco completo delle proprietà CSS su MDN Web Docs](https://developer.mozilla.org/it/docs/Web/CSS/Reference)

Questa pagina contiene descrizioni, esempi e dettagli di compatibilità per ogni proprietà.

---

<!-- Slide 3 -->

# Selettori CSS

Selettori di tipo, classe, ID e universali.

- **Selettore di tipo:** seleziona tutti gli elementi di un certo tipo.

  ```css
  h1 {
    color: green;
  }
  ```

  Tutti gli `<h1>` saranno verdi.

---

- **Selettore di classe:** seleziona tutti gli elementi con una certa classe.

  ```css
  .evidenziato {
    background-color: yellow;
  }
  ```

  Tutti gli elementi con `class="evidenziato"` avranno sfondo giallo.

- **Selettore di ID:** seleziona l'elemento con un certo ID (unico nella pagina).

  ```css
  #intestazione {
    font-size: 24px;
  }
  ```

  L'elemento con `id="intestazione"` avrà dimensione testo 24px.

---

- **Selettore universale:** seleziona tutti gli elementi della pagina.

  ```css
  * {
    margin: 0;
    padding: 0;
  }
  ```

  Tutti gli elementi avranno margini e padding azzerati.

---

## Esercitazione: Sperimenta con i selettori CSS

Crea una pagina HTML con alcuni elementi che abbiano ID, classi e tipi diversi. Scrivi un foglio di stile CSS che:

1. Renda tutti i titoli `<h2>` di colore blu.
2. Applichi uno sfondo giallo agli elementi con la classe `evidenziato`.
3. Imposti la dimensione del testo a 28px per l’elemento con ID `intestazione`.
4. Azzeri margini e padding per tutti gli elementi della pagina.

**Esempio di struttura HTML:**

```html
<h2 id="intestazione">Titolo della pagina</h2>
<p class="evidenziato">Questo paragrafo è evidenziato.</p>
<p>Questo paragrafo non ha classi.</p>
```

---

<!-- Slide 4 -->

# Selettori avanzati

Selettori discendenti, figli, fratelli adiacenti e generali.

## Esempi di selettori avanzati

- **Selettore discendente:** seleziona tutti gli elementi che sono discendenti di un altro elemento.

  ```css
  nav ul li {
    list-style-type: square;
  }
  ```

  Tutti gli `<li>` dentro un `<ul>` dentro un `<nav>` avranno il pallino quadrato.

---

- **Selettore figlio diretto:** seleziona solo gli elementi figli diretti.

  ```css
  div > p {
    color: purple;
  }
  ```

  Solo i `<p>` figli diretti di un `<div>` saranno viola.

---

- **Selettore fratello adiacente:** seleziona l'elemento che segue immediatamente un altro.

  ```css
  h2 + p {
    margin-top: 0;
  }
  ```

  Il `<p>` subito dopo un `<h2>` non avrà margine superiore.

---

- **Selettore fratello generale:** seleziona tutti gli elementi fratelli successivi.

  ```css
  h2 ~ p {
    color: teal;
  }
  ```

  Tutti i `<p>` dopo un `<h2>` avranno il testo color teal.

---

## Esercitazione: Selettori avanzati

Crea una pagina HTML che contenga una struttura simile a questa:

```html
<nav>
  <ul>
    <li>Home</li>
    <li>Chi siamo</li>
    <li>Contatti</li>
  </ul>
</nav>
<div>
  <p>Paragrafo 1</p>
  <p>Paragrafo 2</p>
  <span>Testo span</span>
  <p>Paragrafo 3</p>
</div>
<h2>Titolo</h2>
<p>Paragrafo dopo h2</p>
<p>Altro paragrafo dopo h2</p>
```

---

Scrivi le seguenti regole CSS utilizzando i selettori avanzati:

1. Imposta il tipo di elenco quadrato solo per gli `<li>` dentro un `<nav>`.
2. Rendi viola solo i `<p>` figli diretti di un `<div>`.
3. Rimuovi il margine superiore solo dal `<p>` che segue immediatamente un `<h2>`.
4. Cambia il colore del testo in teal per tutti i `<p>` che seguono un `<h2>` (anche non immediatamente).

**Suggerimento:** Usa i selettori `nav ul li`, `div > p`, `h2 + p`, `h2 ~ p`.

---

<!-- Slide 5 -->

# Selettori di attributo

Come selezionare elementi in base agli attributi HTML.

## Esempi di selettori di attributo

- **Selettore per attributo presente:** seleziona tutti gli elementi che hanno un certo attributo.

  ```css
  input[required] {
    border: 2px solid red;
  }
  ```

  Tutti gli `<input>` con l'attributo `required` avranno un bordo rosso.

---

- **Selettore per valore esatto:** seleziona elementi con un attributo che ha un valore specifico.

  ```css
  a[target="_blank"] {
    color: orange;
  }
  ```

  Tutti i link che si aprono in una nuova scheda saranno arancioni.

---

- **Selettore per valore che inizia con:** seleziona elementi il cui attributo inizia con un certo valore.

  ```css
  img[src^="https://"]
  {
    border: 1px solid green;
  }
  ```

  Tutte le immagini caricate da URL HTTPS avranno un bordo verde.

---

- **Selettore per valore che termina con:** seleziona elementi il cui attributo termina con un certo valore.

  ```css
  a[href$=".pdf"] {
    text-decoration: underline;
  }
  ```

  Tutti i link ai file PDF saranno sottolineati.

---

- **Selettore per valore che contiene:** seleziona elementi il cui attributo contiene una certa stringa.

  ```css
  div[class*="box"] {
    background-color: #eee;
  }
  ```

  Tutti i `<div>` con una classe che contiene la parola "box" avranno uno sfondo grigio chiaro.

---

<!-- Slide 6 -->

# Pseudo-classi

:hover, :active, :focus e altre pseudo-classi utili.

## Esempi di pseudo-classi

- **:hover** – Applica uno stile quando il mouse passa sopra un elemento.

  ```css
  a:hover {
    text-decoration: underline;
    color: red;
  }
  ```

---

- **:active** – Applica uno stile quando l'elemento è attivo (ad esempio, durante il click).

  ```css
  button:active {
    background-color: #ccc;
  }
  ```

---

- **:focus** – Applica uno stile quando l'elemento ha il focus (ad esempio, un campo input selezionato).

  ```css
  input:focus {
    border-color: blue;
    outline: none;
  }
  ```

---

- **:nth-child(n)** – Seleziona il(n)-esimo figlio di un elemento.

  ```css
  li:nth-child(odd) {
    background-color: #f9f9f9;
  }
  ```

Queste pseudo-classi permettono di aggiungere interattività e stili dinamici agli elementi HTML.

---

<!-- Slide 7 -->

# Pseudo-elementi

::before, ::after, ::first-line, ::first-letter.

---

<!-- Slide 8 -->

# Colori in CSS

| Formato | Esempio CSS                    | Descrizione                             |
| ------- | ------------------------------ | --------------------------------------- |
| Nome    | `color: red;`                  | Nome predefinito (es. red, blue, green) |
| HEX     | `color: #ff0000;`              | Codice esadecimale (3 o 6 cifre)        |
| RGB     | `color: rgb(255,0,0);`         | Rosso, verde, blu (0–255)               |
| RGBA    | `color: rgba(255,0,0,0.5);`    | RGB + trasparenza (0–1)                 |
| HSL     | `color: hsl(0,100%,50%);`      | Tonalità, saturazione, luminosità       |
| HSLA    | `color: hsla(0,100%,50%,0.5);` | HSL + trasparenza (0–1)                 |

_HSL: tonalità (0–360), saturazione (0–100%), luminosità (0–100%)._

---

<!-- Slide 9 -->

<!-- Slide 9a -->

# Unità di misura in CSS (parte 1)

| Unità | Esempio CSS        | Descrizione                                                                                                   |
| ----- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| px    | `font-size: 16px;` | Pixel: unità fissa, non scalabile, indipendente dalla dimensione del dispositivo.                             |
| em    | `font-size: 2em;`  | Relativa alla dimensione del font dell’elemento padre. Se il font del genitore è 16px, `2em` equivale a 32px. |

_Nota: Le unità relative come `em` permettono una maggiore flessibilità e adattabilità del layout._

---

<!-- Slide 9b -->

# Unità di misura in CSS (parte 2)

| Unità | Esempio CSS          | Descrizione                                                                                                                                                           |
| ----- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rem   | `font-size: 1.5rem;` | Relativa alla dimensione del font dell’elemento radice (`html`). Se `html` ha `font-size: 16px`, allora `1.5rem` = 24px. Consigliata per coerenza su tutta la pagina. |
| %     | `width: 50%;`        | Percentuale rispetto all’elemento contenitore. Utile per layout fluidi e responsivi.                                                                                  |

_Le unità relative come `rem` e `%` sono utili per layout scalabili e responsivi._

---

<!-- Slide 9c -->

# Unità di misura in CSS (parte 3)

| Unità | Esempio CSS                       | Descrizione                                                                                                                     |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| vw    | `width: 80vw;`                    | Percentuale della larghezza della finestra (viewport width). `100vw` corrisponde all’intera larghezza visibile del browser.     |
| vh    | `height: 50vh;`                   | Percentuale dell’altezza della finestra (viewport height). `100vh` è l’altezza totale della finestra.                           |
| fr    | `grid-template-columns: 1fr 2fr;` | Unità frazionaria usata in CSS Grid per dividere lo spazio disponibile tra le colonne o righe.                                  |
| ch    | `width: 40ch;`                    | Larghezza relativa alla larghezza del carattere "0" del font corrente. Utile per controllare la larghezza dei blocchi di testo. |

_Consiglio: Le unità viewport (`vw`, `vh`), `fr` e `ch` sono fondamentali per design responsivi e layout avanzati._

---

<!-- Slide 10 -->

# Box Model

Margini, bordi, padding e contenuto.

---

<!-- Slide 11 -->

# Proprietà di layout

display, position, float, clear.

---

<!-- Slide 12 -->

# Flexbox

Concetti base: container, item, proprietà principali.

---

<!-- Slide 13 -->

# Flexbox: proprietà container

flex-direction, flex-wrap, justify-content, align-items, align-content.

---

<!-- Slide 14 -->

# Flexbox: proprietà item

order, flex-grow, flex-shrink, flex-basis, align-self.

---

<!-- Slide 15 -->

# CSS Grid

Introduzione al layout a griglia.

---

<!-- Slide 16 -->

# Grid: definizione delle colonne e righe

grid-template-columns, grid-template-rows.

---

<!-- Slide 17 -->

# Grid: posizionamento degli elementi

grid-column, grid-row, grid-area.

---

<!-- Slide 18 -->

# Tipografia in CSS

font-family, font-size, font-weight, line-height, letter-spacing.

---

<!-- Slide 19 -->

# Stili di testo

text-align, text-decoration, text-transform, text-shadow.

---

<!-- Slide 20 -->

# Immagini e background

background-color, background-image, background-size, background-position.

---

<!-- Slide 21 -->

# Bordo e raggio di bordo

border, border-radius, border-style, border-width, border-color.

---

<!-- Slide 22 -->

# Ombre

box-shadow e text-shadow.

---

<!-- Slide 23 -->

# Transizioni CSS

transition-property, transition-duration, transition-timing-function, transition-delay.

---

<!-- Slide 24 -->

# Animazioni CSS

@keyframes, animation-name, animation-duration, animation-iteration-count.

---

<!-- Slide 25 -->

# Media Queries

Responsive design con @media.

---

<!-- Slide 26 -->

# Variabili CSS

Custom properties: --nome-variabile.

---

<!-- Slide 27 -->

# Specificità e cascata

Come il browser decide quali regole applicare.

---

<!-- Slide 28 -->

# Importazione di CSS

@import e collegamento di file esterni.

---

<!-- Slide 29 -->

# Strumenti di sviluppo

Utilizzo degli strumenti del browser per il debug CSS.

---

<!-- Slide 30 -->

# Best practice CSS

Organizzazione, riutilizzo e mantenibilità del codice CSS.

---

# Framework CSS bootstrap

Introduzione a Bootstrap e altri framework popolari.

---# Risorse aggiuntive
Link utili per approfondire lo studio del CSS.

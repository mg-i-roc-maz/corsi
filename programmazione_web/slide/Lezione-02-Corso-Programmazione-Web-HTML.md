---
marp: true
---

<!-- Slide 1 -->

# Interfaccia HTML

Introduzione ai tag HTML e loro utilizzo.

---

<!-- Slide 2 -->

## Cos'è HTML?

## HTML (HyperText Markup Language) è il linguaggio standard per creare pagine web.

### Storia di HTML

HTML nasce nel 1991 grazie a Tim Berners-Lee, che lo sviluppa per condividere documenti scientifici tramite il World Wide Web. La prima versione era molto semplice e includeva pochi tag. Nel tempo, HTML si è evoluto attraverso diverse versioni (HTML 2.0, 3.2, 4.01) fino ad arrivare a HTML5, introdotto nel 2014, che ha aggiunto nuove funzionalità per multimedia, grafica e interattività. Oggi HTML è uno standard fondamentale per la creazione di siti web moderni.

---

<!-- Slide 3 -->

## Struttura di base

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Titolo Pagina</title>
  </head>
  <body>
    Contenuto qui
  </body>
</html>
```

---

<!-- Slide: Editor HTML online -->

## Editor HTML online per test

Puoi provare e testare il codice HTML direttamente online usando editor interattivi. Ecco alcuni strumenti utili:

- [JSFiddle](https://jsfiddle.net/)  
   Editor online per testare codice web e condividerlo facilmente.

- [PlayCode](https://playcode.io/)  
   Ambiente semplice per esperimenti veloci con HTML, CSS e JS.

**Consiglio:** Usa questi editor per esercitarti, vedere subito il risultato e condividere il codice con altri.

---

<!-- Slide: Tag HTML e attributi -->

## Come sono fatti i tag HTML

Un tag HTML è racchiuso tra parentesi angolari `< >`. La maggior parte dei tag ha una versione di apertura `<tag>` e una di chiusura `</tag>`. Alcuni tag, come `<img>` o `<br>`, sono auto-chiudenti.

### Attributi HTML

I tag possono avere attributi, che aggiungono informazioni o modificano il comportamento del tag. Gli attributi sono scritti all'interno del tag di apertura, nella forma `nome="valore"`.

---

**Esempio:**

```html
<a href="https://www.example.com" target="_blank">Visita Example</a>
<img src="foto.jpg" alt="Descrizione" />
```

- `href` e `target` sono attributi del tag `<a>`.
- `src` e `alt` sono attributi del tag `<img>`.

Gli attributi più comuni sono: `id`, `class`, `style`, `src`, `href`, `alt`, `title`, `value`, `type`, ecc.

---

<!-- Slide: Validazione HTML -->

## Come validare i file HTML

### Online

Puoi validare i tuoi file HTML tramite il [W3C Markup Validation Service](https://validator.w3.org/). Basta caricare il file o inserire l'URL della pagina per ricevere un report sugli errori e sulle best practice.

### In locale con VS Code

1. Installa l'estensione **"HTMLHint"** da Visual Studio Code Marketplace.
2. Dopo l'installazione, HTMLHint analizzerà automaticamente i tuoi file HTML e segnalerà eventuali errori o avvisi direttamente nell'editor.
3. Puoi personalizzare le regole di validazione creando un file `.htmlhintrc` nella cartella del progetto.

**Consiglio:** Validare regolarmente il codice aiuta a mantenere la compatibilità e la qualità delle pagine web.

---

<!-- Slide: Compatibilità HTML -->

## Compatibilità dei tag HTML

Non tutti i tag e attributi HTML sono supportati allo stesso modo da tutti i browser. Prima di utilizzare funzionalità avanzate, è importante verificare la compatibilità per evitare problemi di visualizzazione.

### Come verificare la compatibilità

Puoi usare siti come [Can I use](https://caniuse.com/) per controllare quali browser supportano un determinato tag, attributo o tecnologia web. Basta cercare la funzionalità desiderata per vedere una tabella aggiornata con il supporto nei vari browser e versioni.

**Consiglio:** Consulta sempre la compatibilità prima di usare nuove funzionalità, soprattutto se il sito deve funzionare su dispositivi e browser diversi.

---

<!-- Slide 4 -->

## Tag `<html>`

Definisce l'inizio e la fine di un documento HTML.

### Esempio e dettagli aggiuntivi

```html
<html lang="it" dir="ltr">
  <!-- Attributi: lang specifica la lingua, dir la direzione del testo -->
  <head>
    <meta charset="UTF-8" />
    <title>Esempio HTML</title>
  </head>
  <body>
    <h1>Ciao!</h1>
  </body>
</html>
```

---

### Note sugli attributi del tag `<html>`

- Il tag `<html>` può avere **più attributi** (cardinalità: zero o più), come `lang` (lingua del documento) e `dir` (direzione del testo).
- Alcuni attributi sono **obbligatori** in certi contesti (es. `alt` per `<img>`), altri sono **opzionali**.
- La cardinalità degli attributi dipende dal tag: alcuni accettano solo attributi specifici, altri permettono attributi globali (`id`, `class`, `style`, ecc.).
- I valori degli attributi devono essere racchiusi tra virgolette.

---

<!-- Slide 5 -->

## Tag `<head>`

Contiene metadati, titoli, link a CSS e script.

### Esempi di contenuto nel `<head>`

```html
<head>
  <meta charset="UTF-8" />
  <title>Il mio sito</title>
  <link rel="stylesheet" href="stile.css" />
  <script src="script.js"></script>
</head>
```

- `<meta>` definisce i metadati (es. charset).
- `<title>` imposta il titolo della pagina.
- `<link>` collega un foglio di stile CSS.
- `<script>` collega o inserisce codice JavaScript.

---

<!-- Slide 6 -->

## Tag `<title>`

Imposta il titolo della pagina nel browser.

### Esempi di utilizzo

```html
<title>Corso di Programmazione Web</title>
```

- Il testo tra i tag `<title>` appare nella scheda del browser.
- È importante per l'accessibilità e il posizionamento nei motori di ricerca (SEO).
- Ogni pagina dovrebbe avere un titolo unico e descrittivo.

---

<!-- Slide: Introduzione SEO -->

## Cos'è la SEO?

La SEO (Search Engine Optimization) è l’insieme di tecniche che aiutano le pagine web a essere trovate più facilmente dai motori di ricerca come Google.

### Perché è importante?

Se una pagina è ottimizzata per la SEO, sarà più visibile nei risultati di ricerca e avrà più possibilità di essere visitata dagli utenti.

### Cosa c’entra l’HTML?

Scrivere il codice HTML in modo corretto e ordinato aiuta i motori di ricerca a capire meglio il contenuto della pagina. Ad esempio, usare titoli chiari, descrizioni e testi alternativi per le immagini sono semplici accorgimenti che migliorano la SEO.

---

<!-- Slide 7 -->

## Tag `<body>`

Contiene tutto il contenuto visibile della pagina.
Il tag `<body>` è la sezione principale del documento HTML dove vengono inseriti tutti gli elementi visibili all’utente: testi, immagini, link, moduli, tabelle, ecc. Tutto ciò che appare nella pagina web viene scritto all’interno del `<body>`.

### Esempio

```html
<body>
  <h1>Benvenuto!</h1>
  <p>Questa è la parte visibile della pagina.</p>
  <img src="foto.jpg" alt="Foto di esempio" />
</body>
```

- Può contenere qualsiasi altro tag HTML che rappresenta contenuto o struttura.
- È unico per ogni documento HTML: non possono esserci più `<body>`.

---

- Gli stili CSS e gli script JavaScript possono agire sugli elementi all’interno del `<body>`.
- Il `<body>` viene visualizzato dopo che il browser ha caricato i metadati definiti nel `<head>`.

---

<!-- Slide 8 -->

## Tag `<h1>` - `<h6>`

Intestazioni di vari livelli.

```html
<h1>Titolo principale</h1>
<h2>Sottotitolo</h2>
<h3>Sottotitolo di terzo livello</h3>
<h4>Sottotitolo di quarto livello</h4>
<h5>Sottotitolo di quinto livello</h5>
<h6>Sottotitolo di sesto livello</h6>
```

---

## Tag `<p>`

Definisce un paragrafo.

```html
<p>Questo è un paragrafo.</p>
```

## Tag `<br>`

Va a capo (line break).

```html
Testo<br />Nuova linea
```

---

<!-- Slide 11 -->

## Tag `<hr>`

Linea orizzontale.

```html
<hr />
```

<!-- Slide 12 -->

## Tag `<a>`

Collegamento ipertestuale.

```html
<a href="https://www.example.com">Visita Example</a>
```

<!-- Slide 13 -->

## Tag `<img>`

Inserisce un'immagine.

```html
<img src="immagine.jpg" alt="Descrizione" />
```

---

<!-- Slide 14 -->

## Tag `<ul>`, `<ol>`, `<li>`

Liste non ordinate e ordinate.

```html
<ul>
  <li>Elemento 1</li>
  <li>Elemento 2</li>
</ul>
<ol>
  <li>Primo</li>
  <li>Secondo</li>
</ol>
```

---

<!-- Slide 15 -->

## Tag `<table>`

Crea una tabella.

```html
<table>
  <tr>
    <th>Nome</th>
    <th>Cognome</th>
  </tr>
  <tr>
    <td>Mario</td>
    <td>Rossi</td>
  </tr>
</table>
```

---

<!-- Slide: Esercizi pratici HTML -->

## Esercizi HTML - Livello Base

1. **Crea una pagina HTML di base**  
   Scrivi il codice per una pagina che contiene un titolo, un paragrafo e un'immagine.

2. **Aggiungi un link**  
   Inserisci un collegamento che porta a [https://www.wikipedia.org](https://www.wikipedia.org).

---

## Esercizi HTML - Livello Intermedio

3. **Costruisci una lista**  
   Crea una lista non ordinata con almeno tre elementi e una lista ordinata con almeno due elementi.

4. **Tabella semplice**  
   Realizza una tabella con due colonne (Nome, Età) e tre righe di dati.

**Consiglio:** Prova a validare il tuo codice con uno strumento online o con HTMLHint in VS Code dopo ogni esercizio!

---

<!-- Slide 16 -->

## Tag `<form>`

Crea un modulo.

```html
<form>
  <input type="text" name="nome" />
  <input type="submit" value="Invia" />
</form>
```

### Dettagli sul tag `<form>`

- Il tag `<form>` serve per raccogliere dati dagli utenti e inviarli a un server.
- Gli attributi principali sono:
  - `action`: URL a cui vengono inviati i dati.
  - `method`: metodo di invio (`get` o `post`).
  - `enctype`: tipo di codifica dei dati (es. `multipart/form-data` per upload di file).

---

**Esempio con attributi:**

```html
<form action="/invia" method="post">
  <input type="text" name="nome" />
  <input type="submit" value="Invia" />
</form>
```

- All’interno del `<form>` si possono inserire vari campi: `<input>`, `<textarea>`, `<select>`, `<button>`, `<label>`, ecc.
- È buona pratica associare le etichette ai campi tramite l’attributo `for` di `<label>` e l’attributo `id` del campo.
- I dati inviati dal form possono essere elaborati da script lato server (es. PHP, Node.js, Python).

**Consiglio:** Verifica sempre che il form abbia un metodo e un’azione corretti per la sicurezza e la funzionalità.

---

<!-- Slide 17 -->

## Tag `<input>`

Campo di input.

```html
<input type="text" placeholder="Inserisci testo" />
```

<!-- Slide 18 -->

## Tag `<button>`

Crea un pulsante.

```html
<button>Clicca qui</button>
```

<!-- Slide 19 -->

## Tag `<label>`

Etichetta per un campo modulo.

```html
<label for="email">Email:</label> <input id="email" type="email" />
```

---

<!-- Slide 20 -->

## Tag `<select>`, `<option>`

Menu a tendina.

```html
<select>
  <option>Opzione 1</option>
  <option>Opzione 2</option>
</select>
```

---

<!-- Slide 21 -->

## Tag `<textarea>`

Area di testo multilinea.

```html
<textarea rows="4" cols="50"></textarea>
```

---

<!-- Slide 22 -->

## Tag `<div>`

Contenitore generico.

```html
<div>Contenuto</div>
```

---

<!-- Slide 23 -->

## Tag `<span>`

Contenitore inline.

```html
<span>Testo evidenziato</span>
```

---

<!-- Slide 24 -->

## Tag `<strong>`, `<em>`

Testo in grassetto e corsivo.

```html
<strong>Importante</strong> <em>Enfasi</em>
```

---

<!-- Slide 25 -->

## Tag `<header>`, `<footer>`

Intestazione e piè di pagina.

```html
<header>Intestazione</header>
<footer>Piè di pagina</footer>
```

---

<!-- Slide 26 -->

## Tag `<nav>`

Navigazione.

```html
<nav>
  <a href="#home">Home</a>
  <a href="#contatti">Contatti</a>
</nav>
```

---

<!-- Slide 27 -->

## Tag `<main>`

Contenuto principale.

```html
<main>
  <h1>Benvenuto</h1>
</main>
```

---

<!-- Slide 28 -->

## Tag `<section>`

Sezione di contenuto.

```html
<section>
  <h2>Sezione 1</h2>
</section>
```

---

<!-- Slide 29 -->

## Tag `<article>`

Articolo indipendente.

```html
<article>
  <h2>Notizia</h2>
  <p>Testo della notizia.</p>
</article>
```

---

<!-- Slide 30 -->

## Tag `<aside>`

Contenuto a lato.

```html
<aside>
  <p>Informazioni aggiuntive.</p>
</aside>
```

---

<!-- Slide 31 -->

## Tag `<figure>`, `<figcaption>`

Immagine con didascalia.

```html
<figure>
  <img src="foto.jpg" alt="Foto" />
  <figcaption>Didascalia</figcaption>
</figure>
```

---

<!-- Slide 32 -->

## Tag `<iframe>`

Incorpora una pagina web.

```html
<iframe src="https://www.example.com"></iframe>
```

---

<!-- Slide 33 -->

## Tag `<meta>`

Metadati della pagina.

```html
<meta charset="UTF-8" />
```

---

<!-- Slide 34 -->

## Tag `<link>`

Collega risorse esterne.

```html
<link rel="stylesheet" href="stile.css" />
```

---

<!-- Slide 35 -->

## Tag `<script>`

Inserisce codice JavaScript.

```html
<script>
  alert("Ciao!");
</script>
```

---

<!-- Slide 36 -->

## Tag `<style>`

Stili CSS interni.

```html
<style>
  body {
    background: #eee;
  }
</style>
```

---

<!-- Slide 37 -->

## Tag `<sup>`, `<sub>`

Apice e pedice.

```html
H<sub>2</sub>O x<sup>2</sup>
```

---

<!-- Slide 38 -->

## Tag `<code>`, `<pre>`

Codice e testo preformattato.

```html
<pre>
    <code>console.log('Hello');</code>
</pre>
```

---

<!-- Slide 39 -->

## Tag `<audio>`, `<video>`

Media audio e video.

```html
<audio controls src="audio.mp3"></audio>
<video controls src="video.mp4"></video>
```

---

<!-- Slide 40 -->

## Tag `<details>`, `<summary>`

Sezione espandibile.

```html
<details>
  <summary>Mostra dettagli</summary>
  Informazioni nascoste.
</details>
```

---

<!-- Slide: Esercizi HTML - Complessità crescente -->

## Esercizi HTML - Complessità crescente

1. **Crea una pagina HTML con titolo e due paragrafi.**
2. **Inserisci un'immagine con attributo `alt` e una linea orizzontale (`<hr>`).**
3. **Aggiungi una lista non ordinata con almeno quattro elementi.**
4. **Crea una tabella con tre colonne (Nome, Cognome, Età) e due righe di dati.**
5. **Inserisci un link che si apre in una nuova scheda e un altro che punta a una sezione interna della pagina.**
6. **Crea un modulo con un campo di testo, una textarea e un pulsante di invio.**
7. **Aggiungi una sezione `<header>` con un titolo e una barra di navigazione `<nav>` con tre link.**

---

8. **Inserisci una struttura con `<main>`, `<section>`, `<article>` e `<aside>`, ognuno con contenuto testuale.**
9. **Crea una pagina con un `<figure>` che contiene un'immagine e una didascalia, e aggiungi un `<footer>` con un testo.**
10. **Incorpora un video e un audio nella pagina, aggiungi uno stile CSS interno che cambia il colore di sfondo del `<body>`.**

**Consiglio:** Dopo ogni esercizio, valida il codice e verifica la compatibilità dei tag usati!

---
marp: true
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
style: |
  html, body, section, .marp-slide, .marp-slide * {
    font-size: 2.1em !important;
  }
  `
---

<!-- Slide 1 -->

# Interfaccia HTML

Introduzione ai tag HTML e loro utilizzo.

```js
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

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

```html
<tag-nome attributo1="valore1" attributo2="valore2">Contenuto</tag-nome>
```

- `<tag-nome>`: nome del tag HTML.
- `attributo="valore"`: attributi opzionali che modificano il comportamento del tag.
- `Contenuto`: ciò che viene visualizzato tra il tag di apertura e quello di chiusura (se previsto).

---

**Esempio:**

```html
<a href="https://www.example.com" target="_blank">Visita Example</a>
<img src="foto.jpg" alt="Descrizione" />
```

- `href` e `target` sono attributi del tag `<a>`.
- `src` e `alt` sono attributi del tag `<img>`.

---

<!-- Slide: Attributi principali dei tag HTML -->

## Attributi principali dei tag HTML

Ecco una panoramica degli attributi più importanti per i principali tag HTML e il loro significato:

<!-- Slide: Attributi principali dei tag HTML (parte 1) -->

| Tag       | Attributi principali            | Significato                                                |
| --------- | ------------------------------- | ---------------------------------------------------------- |
| `<html>`  | `lang`, `dir`                   | Lingua del documento, direzione del testo                  |
| `<head>`  | Nessuno specifico               | Contenitore di metadati                                    |
| `<title>` | Nessuno                         | Titolo della pagina                                        |
| `<body>`  | Nessuno                         | Contenuto visibile                                         |
| `<a>`     | `href`, `target`, `title`       | URL destinazione, dove aprire il link, descrizione tooltip |
| `<img>`   | `src`, `alt`, `width`, `height` | Percorso immagine, testo alternativo, dimensioni           |

---

<!-- Slide: Attributi principali dei tag HTML (parte 2) -->

| Tag          | Attributi principali                                                             | Significato                                                                                        |
| ------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `<form>`     | `action`, `method`, `enctype`                                                    | URL invio dati, metodo invio, tipo codifica dati                                                   |
| `<input>`    | `type`, `name`, `id`, `value`, `placeholder`, `required`, `readonly`, `disabled` | Tipo campo, nome, identificatore, valore, suggerimento, obbligatorietà, sola lettura, disabilitato |
| `<label>`    | `for`                                                                            | Associa etichetta a campo tramite id                                                               |
| `<select>`   | `name`, `id`, `multiple`                                                         | Nome, identificatore, selezione multipla                                                           |
| `<option>`   | `value`, `selected`                                                              | Valore inviato, selezionato di default                                                             |
| `<textarea>` | `name`, `id`, `rows`, `cols`, `placeholder`                                      | Nome, identificatore, dimensioni, suggerimento                                                     |


---

<!-- Slide: Attributi principali dei tag HTML (parte 3) -->

| Tag                    | Attributi principali                   | Significato                                               |
| ---------------------- | -------------------------------------- | --------------------------------------------------------- |
| `<button>`   | `type`, `name`, `value`, `disabled`                                              | Tipo pulsante, nome, valore, disabilitato                                                          |
| `<table>`              | `border`, `cellpadding`, `cellspacing` | Bordo, spaziatura celle                                   |
| `<tr>`, `<td>`, `<th>` | `colspan`, `rowspan`                   | Celle unite orizzontalmente/verticalmente                 |
| `<link>`               | `rel`, `href`, `type`                  | Relazione, percorso risorsa, tipo file                    |
| `<script>`             | `src`, `type`, `async`, `defer`        | Percorso script, tipo, caricamento asincrono/differito    |
| `<meta>`               | `charset`, `name`, `content`           | Codifica caratteri, nome metadato, valore                 |


---
| Tag                    | Attributi principali                   | Significato                                               |
| ---------------------- | -------------------------------------- | --------------------------------------------------------- |
| `<div>`, `<span>`      | `id`, `class`, `style`                 | Identificatore, classi CSS, stili inline                  |
| `<audio>`, `<video>`   | `src`, `controls`, `autoplay`, `loop`  | Percorso file, controlli, riproduzione automatica, ripeti |
| `<iframe>`             | `src`, `width`, `height`, `title`      | Percorso pagina, dimensioni, descrizione                  |

---
**Nota:** Quasi tutti i tag accettano attributi globali come `id`, `class`, `style`, `title`, `tabindex`, `hidden`.

---

### Esempio di utilizzo attributi

```html
<a href="https://www.example.com" target="_blank" title="Vai a Example"
  >Visita Example</a
>
<img src="foto.jpg" alt="Descrizione immagine" width="200" height="100" />
<input
  type="email"
  name="user_email"
  placeholder="Inserisci la tua email"
  required
/>
```

Gli attributi più comuni sono: `id`, `class`, `style`, `src`, `href`, `alt`, `title`, `value`, `type`, ecc.

---

<!-- Slide: Validazione HTML -->

## Come validare i file HTML

### Online

Puoi validare i tuoi file HTML tramite il [W3C Markup Validation Service](https://validator.w3.org/). Basta caricare il file o inserire l'URL della pagina per ricevere un report sugli errori e sulle best practice.

---

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

Puoi usare siti come [Can I use](https://caniuse.com/) per controllare quali browser supportano un determinato tag, attributo o tecnologia web.

**Consiglio:** Consulta sempre la compatibilità prima di usare nuove funzionalità, soprattutto se il sito deve funzionare su dispositivi e browser diversi.

---

### Documentazione online

[w3schools](https://www.w3schools.com/tags/) <- Ottima risorsa per imparare i tag HTML con esempi pratici.>
[spec.whatwg.org](https://html.spec.whatwg.org/multipage/tables.html) <- Specifica ufficiale HTML5.>

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

- Il tag `<body>` può contenere qualsiasi altro tag HTML che rappresenta contenuto o struttura della pagina.

---

## Tag `<body>` - Dettagli aggiuntivi

- In ogni documento HTML deve esserci **un solo** `<body>`, non sono ammessi più tag `<body>`.

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

---

## Tag `<img>`

Inserisce un'immagine.

```html
<img src="immagine.jpg" alt="Descrizione" />
```

<!-- Slide: Attributi principali del tag `<img>` (parte 1) -->

| Attributo | Descrizione                                                               | Obbligatorio |
| --------- | ------------------------------------------------------------------------- | ------------ |
| `src`     | Percorso o URL dell’immagine da visualizzare                              | Sì           |
| `alt`     | Testo alternativo per l’accessibilità e in caso di errore nel caricamento | Sì           |
| `width`   | Larghezza dell’immagine (in pixel o percentuale)                          | No           |
| `height`  | Altezza dell’immagine (in pixel o percentuale)                            | No           |
| `title`   | Testo visualizzato come tooltip al passaggio del mouse                    | No           |


---

<!-- Slide: Attributi principali del tag `<img>` (parte 2) -->

| Attributo        | Descrizione                                                          | Obbligatorio |
| ---------------- | -------------------------------------------------------------------- | ------------ |
| `loading` | Modalità di caricamento: `lazy` (differito) o `eager` (immediato)         | No           |
| `srcset`         | Elenco di immagini alternative per dispositivi e risoluzioni diverse | No           |
| `sizes`          | Dimensioni da usare con `srcset` per immagini responsive             | No           |
| `crossorigin`    | Gestione delle richieste CORS (`anonymous`, `use-credentials`)       | No           |
| `referrerpolicy` | Politica di invio del referrer                                       | No           |
| `usemap`         | Collega una mappa immagine                                           | No           |
| `ismap`          | Indica che l’immagine è una mappa lato server                        | No           |

---

**Esempio:**

```html
<img
  src="logo.png"
  alt="Logo del sito"
  width="150"
  height="50"
  loading="lazy"
/>
```

---

### Esercizio con il tag `<img>`

inserire un tag con un'immagine esistente e poi provare a inserire un'immagine errata per vedere l'importanza dell'attributo `alt`.

#### immagine errata

```html
<img
  src="logo.svg"
  alt="Logo del sito"
  width="150"
  height="50"
  loading="lazy"
/>
```
---

#### immagine esistente

```html
<img
  src="https://resources.whatwg.org/logo.svg"
  alt="Logo del sito"
  width="150"
  height="50"
  loading="lazy"
/>
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

## Esercizi HTML (valida il codice online o su vscode)

1. **Crea una pagina HTML di base**  
   Scrivi il codice per una pagina che contiene un titolo, un paragrafo e un'immagine.

2. **Aggiungi un link**  
   Inserisci un collegamento che porta a [https://www.wikipedia.org](https://www.wikipedia.org) - verificare online gli attributi del tag `<a>` e provare a utilizzare valori diversi per `target`.

3. **Aggiungi una lista**  
   Crea una lista non ordinata con almeno tre elementi e una lista ordinata con almeno due elementi.

4. **Aggiungi una tabella semplice**  
   Realizza una tabella con tre colonne (Nome, Età, Avatar) e tre righe di dati. Valorizzare la tabella con immagini per gli avatar e dei contenuti di esempio.

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

---

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

---

### Attributi principali del tag `<input>`

Gli attributi più comuni e utili per il campo `<input>` sono:

- `type` — Tipo di campo (es: text, password, email, number, checkbox, radio, file, date, ecc.)
- `name` — Nome del campo (usato per l’invio dei dati)
- `id` — Identificatore univoco (utile per collegare una `<label>`)
- `value` — Valore predefinito del campo
- `placeholder` — Testo suggerito all’interno del campo
- `required` — Rende il campo obbligatorio
- `readonly` — Campo di sola lettura
- `disabled` — Campo disabilitato (non modificabile né inviato)

---

- `maxlength` — Numero massimo di caratteri inseribili
- `minlength` — Numero minimo di caratteri richiesti
- `min` / `max` — Valore minimo/massimo (per numeri, date, ecc.)
- `step` — Incremento consentito (per numeri, date, ecc.)
- `pattern` — Espressione regolare per la validazione del formato
- `autocomplete` — Suggerisce valori già usati (on/off o tipo di dato)
- `autofocus` — Il campo riceve automaticamente il focus all’apertura della pagina
- `checked` — Seleziona di default (solo per checkbox/radio)
- `multiple` — Permette selezioni multiple (solo per file/email)
- `size` — Larghezza visibile del campo (in caratteri)
- `form` — Associa l’input a un form specifico tramite id

---

- `list` — Collega un `<datalist>` per suggerimenti automatici
- `accept` — Tipi di file accettati (solo per input type="file")
- `tabindex` — Ordine di tabulazione

**Esempio:**

```html
<input
  type="email"
  name="user_email"
  id="email"
  placeholder="Inserisci la tua email"
  required
  maxlength="50"
  autocomplete="email"
  autofocus
/>
```
---

<!-- Slide 18 -->

## Tag `<button>`

Crea un pulsante.

```html
<button>Clicca qui</button>
```

### Dettagli sul tag `<button>`

- Il tag `<button>` crea un pulsante cliccabile che può essere usato per inviare form, eseguire script o attivare azioni sulla pagina.
- Può contenere testo, HTML o elementi come immagini e icone.

---

- Attributi principali:
  - `type`: specifica il tipo di pulsante (`button`, `submit`, `reset`). Il valore predefinito è `submit` se il pulsante è dentro un form.
  - `name`: nome del pulsante, utile per l'invio dei dati del form.
  - `value`: valore inviato quando il form viene inviato.
  - `disabled`: disabilita il pulsante.
  - `autofocus`: il pulsante riceve il focus all'apertura della pagina.
  - `form`: associa il pulsante a un form specifico tramite id.

---

**Esempi:**

```html
<button type="button">Normale</button>
<button type="submit">Invia</button>
<button type="reset">Resetta</button>
<button disabled>Disabilitato</button>
<button>
  <img src="icon.png" alt="" /> Con icona
</button>
```

- Il contenuto del pulsante può essere personalizzato con testo, immagini o HTML.
- Per accessibilità, aggiungi sempre un testo descrittivo all'interno del pulsante.

---

## Esercizio: Form di autenticazione

Crea un form HTML per l'autenticazione che richieda username e password. Al click su "Accedi", il form deve inviare i dati tramite POST a un servizio di test online, ad esempio [https://httpbin.org/post](https://httpbin.org/post).

---

**Esercizio:**

```html
<form action="https://httpbin.org/post" method="post">
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" required />

  <label for="password">Password:</label>
  <input type="password" id="password" name="password" required />

  <button type="submit">Accedi</button>
</form>
```

- Usa l’attributo `required` per rendere obbligatori i campi.
- Puoi vedere la risposta del servizio di test dopo l’invio.
- **Consiglio:** Non inserire dati reali, è solo un esempio didattico.

---

## Tag `<label>`

Etichetta per un campo modulo.

```html
<label for="email">Email:</label> <input id="email" type="email" />
```

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

### Esempio di tag `<audio>`

```html
<audio
  controls
  src="https://samplelib.com/lib/preview/mp3/sample-3s.mp3"
></audio>
```

---

### Esempio di tag `<video>`

```html
<video controls width="320" height="240">
  <source
    src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
    type="video/mp4"
  />
  Il tuo browser non supporta il tag video.
</video>
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

<!-- Slide: Come impostare una pagina HTML -->

## Come impostare una pagina HTML

```html
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <title>Titolo della Pagina</title>
  </head>
  <body>
    <!-- Contenuto visibile qui -->
  </body>
</html>
```

- **`<!DOCTYPE html>`**: indica al browser che si tratta di un documento HTML5.
- **`<html lang="it">`**: elemento radice, con attributo per la lingua.
- **`<head>`**: contiene metadati, titolo, link a risorse esterne.
- **`<body>`**: contiene tutto il contenuto visibile della pagina.

---

<!-- Slide: Esercizi HTML - Complessità crescente -->

## Esercizi HTML

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

---

<!-- Slide: Altri concetti fondamentali HTML -->

## Altri elementi e concetti importanti in HTML

### 1. Commenti HTML

I commenti servono per annotare il codice e non vengono visualizzati dal browser.

```html
<!-- Questo è un commento -->
```

---

### 2. Entità HTML

Le entità permettono di inserire caratteri speciali che altrimenti verrebbero interpretati come codice.

- `&lt;` per `<`
- `&gt;` per `>`
- `&amp;` per `&`
- `&quot;` per `"`
- `&copy;` per ©

---

### 3. Attributi globali

Questi attributi possono essere usati su quasi tutti i tag HTML:

- `id`: identificatore univoco
- `class`: una o più classi CSS
- `style`: stili CSS inline
- `title`: testo descrittivo (tooltip)
- `tabindex`: ordine di tabulazione
- `hidden`: nasconde l’elemento

---

### 4. Accessibilità

Scrivere HTML accessibile significa rendere le pagine utilizzabili da tutti, anche da persone con disabilità.

- Usa sempre `alt` per le immagini.
- Struttura i titoli in modo gerarchico (`<h1>`, `<h2>`, ...).
- Usa le etichette (`<label>`) per i campi modulo.
- Preferisci tag semantici (`<nav>`, `<main>`, `<footer>`, ecc.).

---

### 5. Tag semantici

I tag semantici descrivono il significato del contenuto, migliorando SEO e accessibilità:

- `<header>`, `<footer>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`

---

### 6. Best practice

- Indenta il codice per renderlo leggibile.
- Chiudi sempre i tag (anche quelli opzionali, per chiarezza).
- Usa nomi significativi per `id` e `class`.
- Valida spesso il codice.

---

### 7. Struttura annidata

Gli elementi HTML possono essere annidati, ma bisogna rispettare la gerarchia e chiudere correttamente i tag.

```html
<ul>
  <li>Elemento <strong>importante</strong></li>
</ul>
```

---

### 8. Responsive design

HTML lavora insieme a CSS per rendere le pagine adattabili a diversi dispositivi. Usa il tag `<meta name="viewport" ...>` per migliorare la visualizzazione su mobile.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

### Responsive design: dettagli e implementazione

Il **responsive design** permette alle pagine web di adattarsi automaticamente a schermi di dimensioni diverse (desktop, tablet, smartphone), migliorando l’esperienza utente.

#### Principi chiave

- **Layout fluido:** usa unità relative come `%`, `em`, `rem`, `vw`, `vh` invece di pixel fissi.
- **Media queries:** regole CSS che applicano stili diversi in base alla larghezza dello schermo.
- **Immagini responsive:** usa attributi come `srcset` e CSS `max-width: 100%` per adattare le immagini.
- **Tipografia scalabile:** dimensioni dei font che si adattano al dispositivo.

---

#### Esempio pratico

Aggiungi nel `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Esempio di media query CSS:

```html
<style>
  body {
    font-size: 1.2em;
    background-color: #f00;
  }
  @media (max-width: 600px) {
    body {
      font-size: 1em;
      background-color: #0f0;
    }
  }
</style>
<p>Hello World!</p>
```

---

#### Best practice

- Progetta “mobile first”: scrivi prima gli stili per dispositivi piccoli, poi aggiungi media query per schermi più grandi.
- Testa la pagina su diversi dispositivi e simulatori.
- Usa strumenti come Chrome DevTools per simulare varie risoluzioni.

**Risorse utili:**

- [MDN Responsive design](https://developer.mozilla.org/it/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Web Fundamentals: Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)

---

### 9. Collegamento tra file

Puoi collegare file CSS, JavaScript, immagini e altre risorse tramite i tag `<link>`, `<script>`, `<img>`, ecc.

---

### 10. Strumenti di ispezione

I browser moderni offrono strumenti per ispezionare e modificare il codice HTML in tempo reale (tasto destro → "Ispeziona").

**Consiglio:** Approfondisci questi concetti per scrivere pagine HTML più efficaci, accessibili e professionali!

---

<!-- Slide: Esercizi finali HTML -->

## Esercizi finali - Metti in pratica!

1. **Crea una pagina HTML completa**  
   Realizza una pagina che includa:

- Un `<header>` con titolo e navigazione
- Un `<main>` con almeno due `<section>`, una con un `<article>` e una con una tabella
- Un `<aside>` con informazioni aggiuntive
- Un `<footer>` con i tuoi contatti

---

2. **Modulo di contatto**  
   Inserisci un `<form>` con:

- Campi per nome, email, messaggio
- Etichette associate ai campi
- Un pulsante di invio
- Assicurati di usare gli attributi corretti per l’accessibilità

---

3. **Media e stili**

- Aggiungi un’immagine con didascalia usando `<figure>` e `<figcaption>`
- Incorpora un video o un audio
- Inserisci uno stile CSS interno che cambi il colore di sfondo e il colore dei titoli

4. **Link e ancore**

- Crea almeno due link esterni che si aprono in una nuova scheda
- Aggiungi un link interno che porta a una sezione specifica della pagina

5. **Validazione e compatibilità**

- Valida il tuo file HTML con il [W3C Validator](https://validator.w3.org/)
- Controlla la compatibilità dei tag usati su [Can I use](https://caniuse.com/)

---

**Sfida extra:**  
Prova a rendere la pagina responsive aggiungendo il tag `<meta name="viewport" ...>` e verifica come si adatta su dispositivi diversi.

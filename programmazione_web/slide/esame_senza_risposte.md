1. Quale linguaggio è comunemente usato per strutturare il contenuto delle pagine web?
   A) Java  
   B) HTML  
   C) Python  
   D) C++

2. Quale linguaggio viene utilizzato per aggiungere stile alle pagine web?
   A) PHP  
   B) CSS  
   C) Ruby  
   D) SQL

3. Quale linguaggio permette di aggiungere interattività lato client alle pagine web?
   A) C#  
   B) JavaScript  
   C) Go  
   D) Perl

4. Quale protocollo viene usato per trasferire pagine web?
   A) FTP  
   B) SMTP  
   C) HTTP  
   D) SSH  

5. Quale tag HTML viene usato per inserire un’immagine?
   A) <img>  
   B) <picture>  
   C) <src>  
   D) <img>

6. Quale proprietà CSS serve per cambiare il colore del testo?
   A) background-color  
   B) font-size  
   C) color  
   D) text-align

7. Quale metodo JavaScript serve per selezionare un elemento tramite id?
   A) getElementsByClassName  
   B) querySelectorAll  
   C) getElementById  
   D) getElementsByTagName

8. Quale attributo HTML serve per creare un collegamento ipertestuale?
   A) src  
   B) href  
   C) alt  
   D) link

9. Quale tag HTML serve per creare una lista non ordinata?
   A) <ol>  
   B) <dl>  
   C) <li>  
   D) <ul>

10. Quale proprietà CSS serve per rendere un elemento fluttuante a sinistra?
    A) position  
    B) float  
    C) left  
    D) align

11. Quale funzione JavaScript serve per stampare un messaggio nella console?
    A) alert  
    B) print  
    C) console.log  
    D) message

12. Quale tag HTML serve per creare una tabella?
    A) <tr>  
    B) <td>  
    C) <th>  
    D) <table>

13. Quale attributo HTML serve per specificare il testo alternativo di un’immagine?
    A) title  
    B) alt  
    C) src  
    D) text

14. Quale proprietà CSS serve per impostare lo spazio interno di un elemento?
    A) margin  
    B) padding  
    C) border  
    D) spacing

15. Quale metodo JavaScript serve per aggiungere un elemento alla fine di un array?
    A) shift  
    B) push  
    C) pop  
    D) unshift

16. Quale tag HTML serve per creare un campo di input testuale in un form?
    A) <textarea>  
    B) <button>  
    C) <select>  
    D) <input>

17. Quale proprietà CSS serve per nascondere un elemento?
    A) display: block  
    B) visibility: visible  
    C) display: none  
    D) opacity: 1

18. Quale evento JavaScript viene attivato quando si clicca su un elemento?
    A) mouseover  
    B) click  
    C) keydown  
    D) change

19. Quale tag HTML serve per creare un titolo principale?
    A) <h6>  
    B) <p>  
    C) <div>  
    D) <h1>

20. Quale proprietà CSS serve per impostare il tipo di carattere?
    A) font-weight  
    B) font-family  
    C) font-size  
    D) font-style

21. Quale metodo JavaScript serve per rimuovere l’ultimo elemento di un array?
    A) shift  
    B) pop  
    C) push  
    D) splice

22. Quale tag HTML serve per creare una sezione di navigazione?
    A) <section>  
    B) <aside>  
    C) <footer>  
    D) <nav>

23. Quale proprietà CSS serve per impostare la larghezza di un elemento?
    A) height  
    B) width  
    C) size  
    D) length

24. Quale tag HTML serve per inserire un video?
    A) <audio>  
    B) <img>  
    C) <iframe>  
    D) <video>

25. Spiega brevemente cosa sono le media query in CSS e a cosa servono. Inserisci un esempio di utilizzo.

Le media query permettono di applicare stili diversi in base alle caratteristiche del dispositivo, come larghezza dello schermo, per creare layout responsivi.
Esempio di utilizzo:

```css
@media (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}
```

26. Descrivi sinteticamente a cosa serve il modulo CSS Grid. Inserisci un esempio di utilizzo.

CSS Grid serve per creare layout complessi e bidimensionali, organizzando gli elementi in righe e colonne in modo flessibile.
Esempio di utilizzo:

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
```

27. Esercizio pratico: crea una pagina HTML con un form di registrazione

Realizza una pagina HTML che contiene:

- Un form di registrazione con i campi: nome, cognome, username, email e password.
- La validazione dei campi in fase di submit (tutti i campi devono essere compilati, email valida, password di almeno 6 caratteri).
- Uno stile CSS che centri il form al centro della pagina.
- Un menù laterale a sinistra che scompare su dispositivi mobili (larghezza schermo ≤ 600px).

Esempio di soluzione:

```html
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registrazione</title>
    <style>
      body {
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f0f0f0;
      }
      .container {
        display: flex;
        background: #fff;
        box-shadow: 0 0 10px #ccc;
        border-radius: 8px;
        overflow: hidden;
      }
      .menu {
        width: 200px;
        background: #2d3e50;
        color: #fff;
        padding: 30px 20px;
      }
      .form-area {
        padding: 40px 30px;
        min-width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .form-area input {
        margin-bottom: 15px;
        padding: 8px;
        font-size: 1em;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .form-area button {
        padding: 10px;
        background: #2d3e50;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      @media (max-width: 600px) {
        .container {
          flex-direction: column;
          align-items: center;
        }
        .menu {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <nav class="menu">
        <h2>Menù</h2>
        <ul>
          <li>Home</li>
          <li>Registrazione</li>
          <li>Contatti</li>
        </ul>
      </nav>
      <div class="form-area">
        <h2>Registrazione</h2>
        <form id="regForm">
          <input type="text" name="nome" placeholder="Nome" required />
          <input type="text" name="cognome" placeholder="Cognome" required />
          <input type="text" name="username" placeholder="Username" required />
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minlength="6"
          />
          <button type="submit">Registrati</button>
        </form>
        <div id="error" style="color: red; margin-top: 10px;"></div>
      </div>
    </div>
    <script>
      document
        .getElementById("regForm")
        .addEventListener("submit", function (e) {
          const nome = this.nome.value.trim();
          const cognome = this.cognome.value.trim();
          const username = this.username.value.trim();
          const email = this.email.value.trim();
          const password = this.password.value;
          let error = "";
          if (!nome || !cognome || !username || !email || !password) {
            error = "Tutti i campi sono obbligatori.";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            error = "Inserisci una email valida.";
          } else if (password.length < 6) {
            error = "La password deve contenere almeno 6 caratteri.";
          }
          if (error) {
            document.getElementById("error").textContent = error;
            e.preventDefault();
          }
        });
    </script>
  </body>
</html>
```

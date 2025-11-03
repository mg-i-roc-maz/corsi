---
marp: true
---

# Corso di Programmazione in C

## Lezione 10 — Progetto Finale e Ripasso

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Ripassare i concetti principali del corso
- Mettere in pratica tutto quanto appreso
- Realizzare un progetto completo

---

## Quiz a risposta multipla

### 1. Quale delle seguenti dichiarazioni definisce una variabile intera?

- a) `float x;`
- b) `int x;`
- c) `char x;`
- d) `double x;`
- e) `long x[];`

---

**Soluzione:** b  
**Commento:**  
`int x;` dichiara una variabile intera. Le altre opzioni dichiarano variabili di tipo diverso.

---

### 2. Quale operatore viene usato per accedere al valore puntato da un puntatore?

- a) `&`
- b) `*`
- c) `->`
- d) `%`
- e) `#`

---

**Soluzione:** b  
**Commento:**  
L’operatore `*` serve per dereferenziare un puntatore, cioè accedere al valore a cui punta.

---

### 3. Quale funzione si usa per leggere una stringa da tastiera?

- a) `printf`
- b) `scanf`
- c) `gets`
- d) `fopen`
- e) `fscanf`

---

**Soluzione:** c  
**Commento:**  
`gets` legge una stringa da tastiera (anche se è deprecata, meglio usare `fgets`). Le altre funzioni hanno scopi diversi.
`scanf` legge input formattato, ma non è specifica per stringhe e legge fino al primo spazio.

---

### 4. Quale parola chiave serve per dichiarare una costante?

- a) `static`
- b) `const`
- c) `define`
- d) `final`
- e) `fixed`

---

**Soluzione:** b  
**Commento:**  
`const` rende una variabile costante. `#define` serve per le macro, non per variabili.

---

### 5. Quale delle seguenti è la sintassi corretta per dichiarare un array di 10 interi?

- a) `int arr(10);`
- b) `int arr[10];`
- c) `array int arr[10];`
- d) `int[10] arr;`
- e) `arr int[10];`

---

**Soluzione:** b  
**Commento:**  
`int arr[10];` dichiara un array di 10 interi. Le altre sintassi sono errate.

---

### 6. Quale funzione apre un file in modalità scrittura?

- a) `fclose("file.txt", "w");`
- b) `fopen("file.txt", "w");`
- c) `open("file.txt", "w");`
- d) `file("file.txt", "w");`
- e) `write("file.txt");`

---

**Soluzione:** b  
**Commento:**  
`fopen` apre un file; il secondo parametro `"w"` indica la modalità scrittura.

---

### 7. Quale delle seguenti è una struttura di controllo di flusso?

- a) `int`
- b) `for`
- c) `float`
- d) `char`
- e) `return`

---

**Soluzione:** b  
**Commento:**  
`for` è un ciclo di controllo del flusso. Le altre sono tipi o istruzioni.

---

### 8. Come si dichiara una funzione che restituisce un float?

- a) `float funzione();`
- b) `void funzione(float);`
- c) `funzione() float;`
- d) `float = funzione();`
- e) `function float();`

---

**Soluzione:** a  
**Commento:**  
`float funzione();` indica una funzione che restituisce un valore float.

---

### 9. Quale operatore si usa per il confronto di uguaglianza?

- a) `=`
- b) `==`
- c) `!=`
- d) `<>`
- e) `:=`

---

**Soluzione:** b  
**Commento:**  
`==` confronta due valori per l’uguaglianza. `=` serve per l’assegnazione.

---

### 10. Quale delle seguenti è una corretta dichiarazione di puntatore a intero?

- a) `int *p;`
- b) `int p*;`
- c) `*int p;`
- d) `int &p;`
- e) `pointer int p;`

---

**Soluzione:** a  
**Commento:**  
`int *p;` dichiara un puntatore a intero. Le altre sintassi sono errate.

---

### 11. Quale funzione stampa una stringa su schermo?

- a) `scanf`
- b) `printf`
- c) `fopen`
- d) `fscanf`
- e) `main`

---

**Soluzione:** b  
**Commento:**  
`printf` stampa su schermo. `scanf` serve per l’input.

---

### 12. Quale delle seguenti è una struttura dati composta?

- a) `int`
- b) `struct`
- c) `float`
- d) `char`
- e) `double`

---

**Soluzione:** b  
**Commento:**  
`struct` permette di creare strutture dati composte da più campi.

---

### 13. Come si commenta una riga in C?

- a) `# commento`
- b) `// commento`
- c) `-- commento`
- d) `** commento`
- e) `%% commento`

---

**Soluzione:** b  
**Commento:**  
`//` inizia un commento su una riga in C.

---

### 14. Quale delle seguenti è la sintassi corretta per un ciclo while?

- a) `while (condizione) { ... }`
- b) `while condizione { ... }`
- c) `while [condizione] { ... }`
- d) `while {condizione} ...`
- e) `while: condizione { ... }`

---

**Soluzione:** a  
**Commento:**  
La sintassi corretta è `while (condizione) { ... }`.

---

### 15. Quale delle seguenti funzioni converte una stringa in intero?

- a) `atoi`
- b) `itoa`
- c) `strcpy`
- d) `sprintf`
- e) `strcat`

---

**Soluzione:** a  
**Commento:**  
`atoi` converte una stringa in intero. `itoa` fa il contrario.

---

### 16. Quale delle seguenti parole chiave serve per terminare una funzione e restituire un valore?

- a) `break`
- b) `continue`
- c) `return`
- d) `exit`
- e) `stop`

---

**Soluzione:** c  
**Commento:**  
`return` termina la funzione e restituisce un valore.

---

### 17. Quale delle seguenti è la sintassi corretta per dichiarare una struct?

- a) `struct Persona { ... };`
- b) `struct: Persona { ... }`
- c) `Persona struct { ... };`
- d) `struct Persona() { ... };`
- e) `struct { ... } Persona;`

---

**Soluzione:** a  
**Commento:**  
`struct Persona { ... };` è la sintassi corretta per dichiarare una struct.

---

### 18. Quale delle seguenti funzioni serve per allocare memoria dinamicamente?

- a) `malloc`
- b) `free`
- c) `sizeof`
- d) `alloc`
- e) `callocate`

---

**Soluzione:** a  
**Commento:**  
`malloc` alloca memoria dinamicamente. `free` la libera.

---

### 19. Quale delle seguenti è la sintassi corretta per accedere a un membro di una struct tramite puntatore?

- a) `p->campo`
- b) `p.campo`
- c) `*p.campo`
- d) `p:*campo`
- e) `p=>campo`

---

**Soluzione:** a  
**Commento:**  
`p->campo` accede a un membro tramite puntatore a struct.
`p.campo` usato se p è una variabile struct, non un puntatore.

---

### 20. Quale delle seguenti funzioni libera la memoria allocata dinamicamente?

- a) `free`
- b) `delete`
- c) `remove`
- d) `clear`
- e) `dispose`

---

**Soluzione:** a  
**Commento:**  
`free` libera la memoria allocata con `malloc` o simili.

---

### 21. Quale delle seguenti è la sintassi corretta per dichiarare una funzione che non restituisce nulla?

- a) `void funzione();`
- b) `function void();`
- c) `funzione() void;`
- d) `void = funzione();`
- e) `void: funzione();`

---

**Soluzione:** a  
**Commento:**  
`void funzione();` dichiara una funzione che non restituisce valori.

---

### 22. Quale delle seguenti è la sintassi corretta per dichiarare un array di 5 float?

- a) `float arr[5];`
- b) `float arr(5);`
- c) `arr float[5];`
- d) `float[5] arr;`
- e) `array float arr[5];`

---

**Soluzione:** a  
**Commento:**  
`float arr[5];` dichiara un array di 5 float.

---

### 23. Quale delle seguenti funzioni serve per scrivere su un file?

- a) `fprintf`
- b) `fscanf`
- c) `fopen`
- d) `fclose`
- e) `fread`

---

**Soluzione:** a  
**Commento:**  
`fprintf` scrive su un file. `fscanf` legge da file.

---

### 24. Quale delle seguenti parole chiave serve per dichiarare una variabile globale?

- a) `extern`
- b) `static`
- c) `global`
- d) `public`
- e) `shared`

---

**Soluzione:** a  
**Commento:**  
`extern` indica che la variabile è globale e definita altrove.

---

### 25. Quale delle seguenti è la sintassi corretta per un ciclo for?

- a) `for (int i=0; i<10; i++) { ... }`
- b) `for i=0 to 10 { ... }`
- c) `for (i=0; i<10; i++) { ... }`
- d) `for [i=0; i<10; i++] { ... }`
- e) `for {i=0; i<10; i++} ...`

---

**Soluzione:** a  
**Commento:**  
La sintassi standard in C è `for (int i=0; i<10; i++) { ... }`.

---

### 26. Quale delle seguenti funzioni serve per copiare una stringa?

- a) `strcpy`
- b) `strcat`
- c) `strcmp`
- d) `strdup`
- e) `strncpy`

---

**Soluzione:** a  
**Commento:**  
`strcpy` copia una stringa in un’altra.

---

### 27. Quale delle seguenti è la sintassi corretta per dichiarare un puntatore a float?

- a) `float *p;`
- b) `float p*;`
- c) `*float p;`
- d) `float &p;`
- e) `pointer float p;`

---

**Soluzione:** a  
**Commento:**  
`float *p;` dichiara un puntatore a float.

---

### 28. Quale delle seguenti funzioni serve per confrontare due stringhe?

- a) `strcmp`
- b) `strcpy`
- c) `strcat`
- d) `strdup`
- e) `strlen`

---

**Soluzione:** a  
**Commento:**  
`strcmp` confronta due stringhe e restituisce 0 se sono uguali.

---

### 29. Quale delle seguenti parole chiave serve per dichiarare una variabile locale a una funzione?

- a) `auto`
- b) `static`
- c) `register`
- d) `local`
- e) `extern`

---

**Soluzione:** a  
**Commento:**  
`auto` (implicito) indica una variabile locale, anche se raramente usato esplicitamente.

---

### 30. Quale delle seguenti funzioni restituisce la lunghezza di una stringa?

- a) `strlen`
- b) `strcpy`
- c) `strcat`
- d) `strcmp`
- e) `strchr`

---

**Soluzione:** a  
**Commento:**  
`strlen` restituisce la lunghezza di una stringa (escluso il carattere di terminazione).

---

---

## Presentazione del progetto finale

### Scegli uno tra i seguenti:

- **Rubrica telefonica**: inserimento, ricerca, stampa, salvataggio su file
- **Gestione studenti**: inserimento voti, media, salvataggio su file
- **Calcolatrice**: operazioni base, input da tastiera, menu a scelta
- **Gestione magazzino**: inserisci prodotti, cerca, stampa, salva/carica su file

---

## Linee guida per il progetto

- Suddividi il problema in funzioni
- Usa array, struct, puntatori, file dove necessario
- Chiedi dati all’utente e gestisci input errati
- Presenta il progetto a fine lezione

---

## Esercizio Pratico (a gruppi o individuale)

Sviluppa il tuo progetto, testalo, correggi eventuali errori.

---

## Presentazione dei progetti

- Ogni gruppo/individuo illustra la propria soluzione
- Discussione aperta e suggerimenti

---

## Approfondimenti e domande finali

- Domande su esercizi svolti
- Chiarimenti su argomenti ostici
- Consigli per esercitarsi autonomamente

---

## Compiti per il futuro

- Sperimenta con nuovi esercizi e progetti
- Approfondisci i moduli avanzati (puntatori a funzione, strutture dati avanzate, librerie esterne)
- Continua a praticare!

---

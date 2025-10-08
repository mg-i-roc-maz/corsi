---
marp: true
---

# Corso di Programmazione in C

## Lezione 2 — Variabili, Tipi di Dato e Operatori

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Capire cosa sono variabili e costanti
- Saper dichiarare e inizializzare variabili di diversi tipi
- Comprendere i principali tipi di dato in C
- Usare operatori aritmetici, logici, relazionali e di assegnamento
- Risolvere problemi pratici con variabili e operatori

---

## Cos’è una Variabile?

- Zona di memoria a cui assegniamo un nome
- Serve per memorizzare dati durante l’esecuzione del programma
- Ogni variabile ha:
  - Un nome (identificatore)
  - Un tipo (intero, carattere, reale, ...)
  - Un valore

### Esempio

```c
int eta = 22;
float peso = 70.5;
char lettera = 'A';
```

---

## Esercizio Pratico 1

Dichiara e inizializza queste variabili:

- Un intero di nome `x` con valore 15
- Un float di nome `temperatura` con valore 22.3
- Un carattere di nome `iniziale` con valore 'L'

---

## Regole sui Nomi delle Variabili

- Devono iniziare con una lettera o underscore `_`
- Non possono contenere spazi o simboli speciali
- Case sensitive: `Eta` e `eta` sono variabili diverse
- Non usare parole riservate (`int`, `return`, ...)

### Mini-Challenge

Trova l’errore nei seguenti nomi di variabile:

- `2nome`
- `float`
- `mia-variabile`
- `_conta`

---

## Parole Chiave Riservate in C

Le parole chiave (keyword) sono riservate dal linguaggio e non possono essere usate come nomi di variabili o funzioni.

Ecco le principali parole chiave in C:

```
auto      break     case      char      const     continue
default   do        double    else      enum      extern
float     for       goto      if        int       long
register  return    short     signed    sizeof    static
struct    switch    typedef   union     unsigned  void
volatile  while
```

Utilizza sempre nomi diversi da queste parole per le tue variabili!

---

## Tipi di Dato Principali

| Tipo     | Descrizione                    | Esempio       |
| -------- | ------------------------------ | ------------- |
| int      | Numero intero                  | 5, -3, 100    |
| float    | Numero reale (virgola mobile)  | 3.14, -0.5    |
| double   | Numero reale doppia precisione | 2.718281828   |
| char     | Carattere singolo              | 'A', 'z', '0' |
| unsigned | Intero solo positivo           | 0, 100, 255   |

---

### Esempi di Dichiarazione

```c
int eta = 30;
float prezzo = 19.99;
double pi_greco = 3.1415926535;
char iniziale = 'G';
unsigned int conteggio = 100;
```

---

## Esercizio Pratico 2

Scrivi un programma che dichiara una variabile per ogni tipo base (int, float, double, char) e stampa il valore di ciascuna.

---

### Soluzione Esercizio Pratico 2

```c
#include <stdio.h>

int main() {
  int numero = 10;
  float decimale = 3.14f;
  double doppio = 2.718281828;
  char carattere = 'C';

  printf("int: %d\n", numero);
  printf("float: %f\n", decimale);
  printf("double: %lf\n", doppio);
  printf("char: %c\n", carattere);

  return 0;
}
```

---

## Costanti

- Valore che non può essere modificato dopo l’assegnazione
- Due modi principali:

### 1. `#define`

```c
#define PI 3.14
```

### 2. `const`

```c
const float pi = 3.14;
```

---

## Esercizio Pratico 3

Definisci una costante per il valore di gravità (`g = 9.81`) usando sia `#define` che `const`.  
Stampa il valore a schermo.

## Esercizio Pratico 3b

Scrivi un programma che definisce una costante per la gravità sulla Terra (`g_terra = 9.81`).  
Calcola la gravità sulla Luna e su Marte a partire da quella terrestre, usando i rapporti:

- Luna: `g_luna = g_terra * 0.165`
- Marte: `g_marte = g_terra * 0.378`

Stampa tutti e tre i valori a schermo.

---

### Soluzione Esercizio Pratico 3

```c
#include <stdio.h>

#define G 9.81

int main() {
  const float g = 9.81;

  printf("Valore di gravità con #define: %f\n", G);
  printf("Valore di gravità con const: %f\n", g);

  return 0;
}
```

---

### Soluzione Esercizio Pratico 3b

```c
#include <stdio.h>

int main() {
  const float g_terra = 9.81;
  float g_luna = g_terra * 0.165;
  float g_marte = g_terra * 0.378;

  printf("Gravità sulla Terra: %f\n", g_terra);
  printf("Gravità sulla Luna: %f\n", g_luna);
  printf("Gravità su Marte: %f\n", g_marte);

  return 0;
}
```

---

## Input da Tastiera

- Funzione `scanf` per leggere dati inseriti dall’utente

```c
int numero;
printf("Inserisci un numero: ");
scanf("%d", &numero);
```

- `%d` per int, `%f` per float, `%c` per char
- Usare `&` davanti al nome della variabile (indirizzo di memoria)

---

### Esempio

```c
float prezzo;
printf("Inserisci il prezzo: ");
scanf("%f", &prezzo);
printf("Hai inserito: %f", prezzo);
```

---

## Esercizio Pratico 4

Scrivi un programma che chiede all’utente nome (stringa di max 20 caratteri) e età, poi stampa:  
“Ciao [nome], hai [età] anni!”

Suggerimento:  
Usa `char nome[20];` e `scanf("%s", nome);`

> **Nota:** Nel caso di `scanf("%s", nome);` non si usa `&nome` perché `nome` è un array di caratteri (una stringa C) e il nome dell’array rappresenta già l’indirizzo della sua prima cella di memoria.  
> Per i tipi primitivi (`int`, `float`, ecc.) invece si usa `&` per passare l’indirizzo della variabile.

---

## Operatori Aritmetici

| Operatore | Significato     | Esempio          |
| --------- | --------------- | ---------------- |
| +         | Addizione       | a + b            |
| -         | Sottrazione     | a - b            |
| \*        | Moltiplicazione | a \* b           |
| /         | Divisione       | a / b            |
| %         | Modulo (resto)  | a % b (solo int) |

#### Esempio

```c
int a = 10, b = 3;
int somma = a + b;        // 13
int resto = a % b;        // 1
float divisione = a / (float)b; // 3.3333
```

---

## Esercizio Pratico 5

Chiedi due numeri interi all’utente e stampa:

- la somma
- la differenza
- il prodotto
- il quoziente intero della divisione (operatore `/`)
- il resto della divisione (operatore `%`)

---

## Operatori di Assegnamento

| Operatore | Significato         | Esempio          |
| --------- | ------------------- | ---------------- |
| =         | Assegnazione        | a = 5            |
| +=        | Addizione e assegn. | a += 2 (a = a+2) |
| -=        | Sottr. e assegn.    | a -= 1           |
| \*=       | Moltip. e assegn.   | a \*= 3          |
| /=        | Divisione e assegn. | a /= 2           |

---

## Operatori di Incremento/Decremento

- `a++` incrementa di 1 (equivalente a `a = a + 1`)
- `a--` decrementa di 1

```c
int a = 5;
a++; // a ora vale 6
```

```c
a++;  // incrementa a di 1 (post-incremento)
++a;  // incrementa a di 1 (pre-incremento)
a--;  // decrementa a di 1 (post-decremento)
--a;  // decrementa a di 1 (pre-decremento)
```

---

## Mini-Challenge: Indovina il risultato

```c
int x = 7;
x++;
++x;
x -= 2;
printf("%d", x); // Cosa stampa?
```

---

## Mini-Challenge: Indovina il risultato

**Soluzione:**  
Il valore di `x` dopo le operazioni è 8.

```c
int x = 7;
x++;   // x = 8
++x;   // x = 9
x -= 2; // x = 7
printf("%d", x); // Stampa: 7
```

**Risposta:**  
Il programma stampa `7`.

---

## Operatori Relazionali

| Operatore | Significato     | Esempio |
| --------- | --------------- | ------- |
| ==        | Uguale          | a == b  |
| !=        | Diverso         | a != b  |
| >         | Maggiore        | a > b   |
| <         | Minore          | a < b   |
| >=        | Maggiore uguale | a >= b  |
| <=        | Minore uguale   | a <= b  |

---

## Operatori Logici

| Operatore | Significato    | Esempio               |
| --------- | -------------- | --------------------- |
| &&        | E logico (AND) | (a > 0) && (b < 10)   |
| \|\|      | O logico (OR)  | (a > 0) \|\| (b < 10) |
| !         | Negazione      | !(a == b)             |

---

### Esempio: Uso combinato

```c
int a = 5, b = 10;
if ((a < b) && (a != 0)) {
    printf("Condizione vera\n");
}
```

---

## Esercizio Pratico 6

Scrivi un programma che chiede tre numeri interi all’utente e stampa il maggiore.

---

## Attenzione alla Divisione tra Interi

```c
int a = 7, b = 2;
float risultato = a / b; // = 3, non 3.5!
float risultato_corretto = a / (float)b; // = 3.5
```

- Se entrambi sono int, il risultato è int (tronca la parte decimale!)

---

## Esercizio Pratico 7

Chiedi due numeri reali, calcola la media e stampa il risultato con due cifre decimali.

---

## Variabili Non Inizializzate

- Il valore è indefinito, può essere qualunque cosa!
- Sempre inizializzare le variabili prima dell’uso

### Mini-Challenge

Che cosa stampa questo programma?

```c
int x;
printf("%d", x);
```

---

## Errori Comuni

- Dimenticare di inizializzare la variabile
- Usare il tipo sbagliato nel `scanf`/`printf`
- Dimenticare `&` nel `scanf`
- Confondere `=` (assegnazione) con `==` (uguaglianza)

---

## ESERCIZI DI RIEPILOGO E APPROFONDIMENTO

### Esercizio 8

Scrivi un programma che chiede il lato di un quadrato, calcola e stampa:

- Area
- Perimetro

### Esercizio 9

Scrivi un programma che chiede una temperatura in gradi Celsius e la converte in Fahrenheit  
(formula: F = C \* 9/5 + 32)

---

## Esercizio Finale Guidato

Scrivi un programma che:

1. Chiede all’utente il raggio di un cerchio (float)
2. Calcola e stampa area e circonferenza  
   (area = π _ r _ r, circonferenza = 2 _ π _ r)
3. Usa una costante per π

---

## IDEE PER ESERCITAZIONI EXTRA

- Calcolatrice base (somma, sottrazione, prodotto, divisione)
- Conversione da euro a dollari (tasso fisso)
- Programma che chiede nome, cognome, età e li stampa in una frase di presentazione

---

## Riepilogo della Lezione

- Variabili e tipi di dato
- Costanti
- Input/output di base
- Operatori aritmetici, relazionali, logici
- Errori comuni da evitare

---

## Compiti a Casa

- Scrivi un programma che calcoli la media di tre numeri inseriti dall’utente
- Prova a cambiare tipo di variabile e osserva cosa succede
- Sperimenta con altri operatori e stampa i risultati

---

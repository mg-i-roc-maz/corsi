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

## Mini-Challenge: Incrementi con float e double

Cosa succede se usiamo gli operatori di incremento con variabili float o double?

```c
float f = 1.5f;
f++;
printf("%f\n", f); // Cosa stampa?
```

**Curiosità:**  
Gli operatori `++` e `--` funzionano anche con float e double, aggiungendo o sottraendo 1.0.

---

## Mini-Challenge: Incrementi su char

Cosa succede se incrementiamo una variabile di tipo `char`?

```c
char c = 'A';
c++;
printf("%c\n", c); // Cosa stampa?
```

**Curiosità:**  
I caratteri sono rappresentati da numeri (codici ASCII). Incrementando `'A'` otteniamo `'B'`.

---

## Approfondimento: Il Cifrario di Cesare

Il **cifrario di Cesare** è uno dei più semplici e antichi sistemi di cifratura. Prende il nome da Giulio Cesare, che lo utilizzava per comunicare con i suoi generali. Il metodo consiste nello spostare ogni lettera del messaggio originale di un numero fisso di posizioni nell’alfabeto. Ad esempio, con uno spostamento di 3, la lettera `A` diventa `D`, `B` diventa `E` e così via. Se si supera la `Z`, si ricomincia dall’inizio dell’alfabeto.

---
### Come funziona

- Si sceglie uno **spostamento** (ad esempio 3).
- Ogni lettera del messaggio viene sostituita dalla lettera che si trova “più avanti” di tante posizioni quante indica lo spostamento.
- Se si supera la Z, si ricomincia dall’inizio dell’alfabeto.

---

**Esempio con spostamento 3:**

- Messaggio originale: `CIAO`
- Messaggio cifrato: `FLDR`

| Lettera | +3 posizioni | Risultato |
| ------- | ------------ | --------- |
| C       | D E F        | F         |
| I       | J K L        | L         |
| A       | B C D        | D         |
| O       | P Q R        | R         |

---
### Decifrare

Per decifrare, basta **spostare indietro** di 3 posizioni.

---
### Implementazione in C (con array: cifratura di una parola intera)

```c
#include <stdio.h>
#include <string.h>

int main() {
  char parola[100];
  int shift = 3;
  int i, n;

  printf("Inserisci una parola (lettere maiuscole e/o minuscole): ");
  scanf("%s", parola);

  n = strlen(parola);

  for (i = 0; i < n; i++) {
    char ch = parola[i];
    if (ch >= 'A' && ch <= 'Z') {
      parola[i] = ((ch - 'A' + shift) % 26) + 'A';
    } else if (ch >= 'a' && ch <= 'z') {
      parola[i] = ((ch - 'a' + shift) % 26) + 'a';
    }
    // Se non è una lettera, la lasciamo invariata
  }

  printf("Parola cifrata: %s\n", parola);

  return 0;
}
```

---
## Tabella ASCII — Solo Lettere

| Dec | Sim | Dec | Sim | Dec | Sim | Dec | Sim | Dec | Sim | Dec | Sim | Dec | Sim |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 65  |  A  | 66  |  B  | 67  |  C  | 68  |  D  | 69  |  E  | 70  |  F  | 71  |  G  |
| 72  |  H  | 73  |  I  | 74  |  J  | 75  |  K  | 76  |  L  | 77  |  M  | 78  |  N  |
| 79  |  O  | 80  |  P  | 81  |  Q  | 82  |  R  | 83  |  S  | 84  |  T  | 85  |  U  |
| 86  |  V  | 87  |  W  | 88  |  X  | 89  |  Y  | 90  |  Z  | 97  |  a  | 98  |  b  |
| 99  |  c  |100  |  d  |101  |  e  |102  |  f  |103  |  g  |104  |  h  |105  |  i  |
|106  |  j  |107  |  k  |108  |  l  |109  |  m  |110  |  n  |111  |  o  |112  |  p  |
|113  |  q  |114  |  r  |115  |  s  |116  |  t  |117  |  u  |118  |  v  |119  |  w  |
|120  |  x  |121  |  y  |122  |  z  |     |     |     |     |     |     |     |     |

<sub>Legenda: Dec = valore decimale ASCII, Sim = lettera</sub>

## Mini-Challenge: Incrementi multipli

Prevedi il risultato di questo codice:

```c
int a = 3;
int b = a++ + ++a;
printf("%d\n", b); // ?
```

**Soluzione:**

- `a++` restituisce 3 (poi a diventa 4)
- `++a` incrementa a a 5 e restituisce 5
- `b = 3 + 5 = 8`

---

## Mini-Challenge: Incrementi e tipi unsigned

Cosa succede se decrementiamo una variabile unsigned che vale 0?

```c
unsigned int u = 0;
u--;
printf("%u\n", u); // ?
```

**Curiosità:**  
Le variabili unsigned non possono essere negative. Se scendono sotto 0, "girano" al valore massimo rappresentabile (overflow).

---

## Tabella: Intervallo di Valori per i Tipi di Dato Principali (1/2)

| Tipo            | Valore Minimo      | Valore Massimo       |
|-----------------|--------------------|----------------------|
| `int`           | -2.147.483.648     | 2.147.483.647        |
| `unsigned int`  | 0                  | 4.294.967.295        |
| `short`         | -32.768            | 32.767               |
| `unsigned short`| 0                  | 65.535               |
| `long`          | -2.147.483.648     | 2.147.483.647        |
| `unsigned long` | 0                  | 4.294.967.295        |

---

## Tabella: Intervallo di Valori per i Tipi di Dato Principali (2/2)

| Tipo            | Valore Minimo                | Valore Massimo                |
|-----------------|-----------------------------|-------------------------------|
| `char`          | -128                        | 127                           |
| `unsigned char` | 0                           | 255                           |
| `float`         | ~1.2 × 10<sup>-38</sup>     | ~3.4 × 10<sup>38</sup>        |
| `double`        | ~2.2 × 10<sup>-308</sup>    | ~1.8 × 10<sup>308</sup>       |

<sub>I valori possono variare a seconda dell’implementazione e dell’architettura, ma questi sono i più comuni su sistemi a 32 bit.</sub>

---

## Mini-Challenge: Incrementi in espressioni complesse

Prevedi il valore finale di `x` e `y`:

```c
int x = 5;
int y = x++ * 2 + --x;
printf("x = %d, y = %d\n", x, y);
```

**Soluzione:**

- `x++` restituisce 5 (x diventa 6)
- `--x` decrementa x a 5 e restituisce 5
- `y = 5 * 2 + 5 = 15`
- Alla fine: `x = 5`, `y = 15`

---

## Priorità degli Operatori in C

Gli operatori in C hanno una priorità (precedenza) che determina l’ordine di valutazione nelle espressioni. Gli operatori con priorità più alta vengono valutati per primi.

| Priorità | Operatori              | Descrizione                                    |
| -------- | ---------------------- | ---------------------------------------------- |
| 1        | `()`                   | Parentesi                                      |
| 2        | `++` `--` `!` `(tipo)` | Incremento, decremento, negazione logica, cast |
| 3        | `*` `/` `%`            | Moltiplicazione, divisione, modulo             |
| 4        | `+` `-`                | Addizione, sottrazione                         |
| 5        | `<` `<=` `>` `>=`      | Relazionali                                    |

---

## Priorità degli Operatori in C

| Priorità | Operatori                              | Descrizione                                    |
| -------- | -------------------------------------- | ---------------------------------------------- |
| 6        | `==` `!=`                              | Uguaglianza, diversità                         |
| 7        | `&&`                                   | AND logico                                     |
| 8        | <code>&#124;&#124;</code>              | OR logico                                      |
| 9        | `=` `+=` `-=` `*=` `/=` `%=`           | Assegnamento                                   |

**Nota:**  
Quando operatori hanno la stessa priorità, l’ordine di valutazione è da sinistra a destra (associatività sinistra), tranne che per l’assegnamento (associatività destra).

---

## Esempi Pratici sulla Priorità degli Operatori

### Esempio 1: Parentesi e Priorità

```c
int risultato1 = 2 + 3 * 4;      // = 14 (moltiplicazione prima di addizione)
int risultato2 = (2 + 3) * 4;    // = 20 (parentesi prima di moltiplicazione)
printf("%d %d\n", risultato1, risultato2);
```

### Esempio 2: Operatori Relazionali e Logici

```c
int a = 5, b = 10, c = 15;
int condizione = a < b && b < c; // true (1), perché entrambe le condizioni sono vere
printf("%d\n", condizione);
```

---

## Esempi Pratici sulla Priorità degli Operatori

### Esempio 3: Assegnamento e Incremento

```c
int x = 2;
x += 3 * 2; // equivale a x = x + (3 * 2) = 8
printf("%d\n", x);
```

### Esempio 4: Uso del Cast

```c
int a = 7, b = 2;
float divisione = a / b;           // = 3 (divisione tra interi)
```

---

## Perché si fa il cast di uno solo?

Quando si esegue una divisione tra due variabili di tipo `int`, il risultato sarà anch’esso un intero (la parte decimale viene eliminata). Per ottenere un risultato con la parte decimale, basta fare il cast di **almeno uno** degli operandi a `float` o `double`. Questo è sufficiente perché il compilatore converte automaticamente anche l’altro operando al tipo più "ampio" (promozione di tipo).

### Esempio

```c
int a = 7, b = 2;
float risultato = (float)a / b; // = 3.5
```

Qui solo `a` viene convertito a `float`, ma anche `b` viene promosso a `float` per la divisione.

---

## Perché si fa il cast di uno solo?

Fare il cast di entrambi è possibile, ma non necessario:

```c
float risultato = (float)a / (float)b; // = 3.5
```

**In sintesi:**  
Basta il cast di uno solo degli operandi per ottenere una divisione con risultato reale.

```
printf("%f %f\n", divisione, divisione_corretto);
```

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

## Lo Specificatore di Formato `%` in C

Lo specificatore di formato `%` viene usato nelle funzioni `printf` e `scanf` per indicare il tipo di dato da stampare o leggere.
### Dettagli d'Uso

- `%d` / `%i`: interi decimali (es. `printf("%d", 42);`)
- `%u`: interi senza segno (`unsigned int`)
- `%f`: numeri reali (float/double in `printf`, solo float in `scanf`)
- `%lf`: per double in `scanf` (in `printf` si usa comunque `%f`)
- `%c`: caratteri singoli
- `%s`: stringhe (array di char)
- `%x` / `%X`: interi in esadecimale (minuscolo/maiuscolo)
- `%o`: interi in ottale
- `%p`: indirizzi di memoria (puntatori)
---
#### Opzioni aggiuntive

- **Precisione**: controlla il numero di cifre decimali stampate per float/double  
  Esempio: `%.2f` stampa due cifre decimali (`3.14`)

- **Larghezza minima**: imposta la larghezza minima del campo  
  Esempio: `%8d` stampa l’intero in almeno 8 spazi

- **Segno**: stampa sempre il segno (`+` o `-`)  
  Esempio: `%+d` stampa `+42` invece di `42`

- **Combinazioni**: puoi combinare larghezza, precisione e segno  
  Esempio: `%+8.2f` stampa un float con segno, almeno 8 spazi, 2 decimali

---

#### Esempi

```c
printf("%+8.2f\n", 3.14159); // stampa: "   +3.14"
printf("%08d\n", 42);        // stampa: "00000042"
printf("%.3s\n", "ciao");    // stampa: "cia"
printf("%8d\n", 123);      // stampa "     123"
printf("%.2f\n", 3.14159); // stampa "3.14"
printf("%8.2f\n", 3.14159);// stampa "    3.14"
```

---

### Stampare Sempre il Segno (+/-) con printf

Per stampare sempre il segno di un numero (anche il `+` per i numeri positivi), puoi usare il modificatore `%+d` per gli interi e `%+f` per i float/double.

```c
int x = 42;
int y = -7;
float z = 3.14;
float w = -2.5;

printf("%+d\n", x); // stampa: +42
printf("%+d\n", y); // stampa: -7
printf("%+f\n", z); // stampa: +3.140000
printf("%+f\n", w); // stampa: -2.500000
```

Puoi anche combinare il segno con la precisione:

```c
printf("%+.2f\n", z); // stampa: +3.14
```

---

### Esempi Pratici

```c
int a = 42;
float b = 3.1415;
char c = 'Z';
char nome[] = "Anna";

printf("Intero: %d\n", a);
printf("Float: %.2f\n", b);
printf("Carattere: %c\n", c);
printf("Stringa: %s\n", nome);
```

---

### Attenzione con `scanf`

- Per `float` si usa `%f`
- Per `double` si usa `%lf`
- Per `char` e `int` si usano `%c` e `%d`
- Per stringhe: `%s` (senza `&` davanti al nome dell’array)

---

### Riepilogo

- Usa sempre lo specificatore corretto per il tipo di dato
- Puoi combinare larghezza e precisione (`%8.3f`)
- `%` è fondamentale per input/output formattato in C

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

# Approfondimento: Tipi di Dato, Dimensioni e Architetture

---

## Dimensione in Byte dei Tipi di Dato Principali

Ogni tipo di dato in C occupa una quantità di memoria diversa, misurata in **byte**. La dimensione può variare in base all’architettura e al compilatore, ma questi sono i valori tipici su sistemi a 32 bit:

| Tipo             | Dimensione (byte) | Esempio dichiarazione      |
|------------------|------------------|----------------------------|
| `char`           | 1                | `char c;`                  |
| `unsigned char`  | 1                | `unsigned char uc;`        |
| `short`          | 2                | `short s;`                 |
| `unsigned short` | 2                | `unsigned short us;`       |
| `int`            | 4                | `int i;`                   |
| `unsigned int`   | 4                | `unsigned int ui;`         |

---
| Tipo             | Dimensione (byte) | Esempio dichiarazione      |
|------------------|------------------|----------------------------|
| `long`           | 4                | `long l;`                  |
| `unsigned long`  | 4                | `unsigned long ul;`        |
| `float`          | 4                | `float f;`                 |
| `double`         | 8                | `double d;`                |

<sub>Nota: su sistemi a 64 bit, `long` e `unsigned long` possono occupare 8 byte.</sub>

--- 

## Differenza tra `long` e `int` in C

- **`int`** e **`long`** sono entrambi tipi di dato interi, ma differiscono per la **dimensione** (numero di byte) e quindi per l’intervallo di valori rappresentabili.
- Su molti sistemi a 32 bit:
  - `int` occupa **4 byte** (32 bit)
  - `long` occupa **4 byte** (32 bit)
- Su sistemi a 64 bit (come Linux/Mac a 64 bit):
  - `int` occupa **4 byte** (32 bit)
  - `long` occupa **8 byte** (64 bit)
- L’intervallo di valori di `long` è quindi **maggiore** rispetto a `int` su sistemi dove `long` è più grande.
- Per portabilità, non dare per scontato che abbiano la stessa dimensione: usa sempre `sizeof()` per verificarlo.

---

| Tipo   | Dimensione tipica | Intervallo valori (signed)         |
|--------|-------------------|------------------------------------|
| int    | 4 byte            | -2.147.483.648 a 2.147.483.647     |
| long   | 4 o 8 byte        | -2.147.483.648 a 2.147.483.647 (4b)<br>-9.223.372.036.854.775.808 a 9.223.372.036.854.775.807 (8b) |

**Esempio:**
```c
printf("int: %zu byte\n", sizeof(int));
printf("long: %zu byte\n", sizeof(long));
```

> **Nota:**  
> Prova a compilare ed eseguire questo codice sul tuo computer per vedere le dimensioni effettive dei tipi di dato nel tuo ambiente!



---

### Come verificare la dimensione con `sizeof`

Puoi usare l’operatore `sizeof` per scoprire quanti byte occupa un tipo di dato sul tuo sistema:

```c
#include <stdio.h>

int main() {
  printf("char: %zu byte\n", sizeof(char));
  printf("int: %zu byte\n", sizeof(int));
  printf("float: %zu byte\n", sizeof(float));
  printf("double: %zu byte\n", sizeof(double));
  return 0;
}
```

---

## Dettaglio sullo Specificatore `%zu`

- Lo **specificatore di formato** `%zu` si usa con `printf` per stampare valori di tipo `size_t`.
- `size_t` è il tipo restituito da `sizeof` e rappresenta una quantità di memoria o il numero di elementi (sempre non negativa).
- `%zu` garantisce la corretta stampa di `size_t` su tutte le architetture (32 o 64 bit).

### Esempio

```c
size_t n = 10;
printf("Numero di elementi: %zu\n", n);
```

> **Nota:**  
> Non usare `%d` o `%u` per `size_t`, perché la dimensione può variare tra sistemi diversi.

---

---

## Bit, Byte e Architetture Moderne

### Cos’è un Bit? Cos’è un Byte?

- **Bit**: la più piccola unità di informazione, può valere 0 o 1.
- **Byte**: gruppo di 8 bit. È l’unità base per misurare la memoria nei computer.

| Unità   | Equivalenza         |
|---------|---------------------|
| 1 bit   | 0 o 1               |
| 1 byte  | 8 bit               |
| 1 KB    | 1024 byte           |
| 1 MB    | 1024 KB             |
| 1 GB    | 1024 MB             |

---

### Architetture a 32 e 64 bit

- L’**architettura** di un processore indica quanta memoria può gestire e la dimensione dei dati che può elaborare in un’operazione.
- **32 bit**: può indirizzare fino a 4 GB di memoria (2<sup>32</sup> byte).
- **64 bit**: può indirizzare fino a 16 exabyte (2<sup>64</sup> byte), molto più della RAM disponibile oggi.

| Architettura | RAM massima indirizzabile | Dimensione tipica di `int` | Dimensione tipica di `long` |
|--------------|--------------------------|----------------------------|-----------------------------|
| 32 bit       | 4 GB                     | 4 byte                     | 4 byte                      |
| 64 bit       | Molto superiore (TB/EB)  | 4 byte                     | 8 byte                      |

---

### Esempi Pratici: Computer e Cellulari

- **PC moderni**: quasi tutti sono a 64 bit (Windows, Linux, Mac).
- **Smartphone**:
  - Android e iPhone recenti usano processori ARM a 64 bit.
  - Esempio: un iPhone 14 ha un processore A15/A16 a 64 bit.
  - Anche molti telefoni economici Android sono ormai a 64 bit.
- **Vecchi telefoni** (prima del 2015 circa) spesso avevano CPU a 32 bit.

---

### Perché è importante?

- Un’architettura a 64 bit permette di usare più RAM e gestire dati più grandi in modo più efficiente.
- Alcuni programmi (app, giochi) richiedono dispositivi a 64 bit per funzionare.
- Le dimensioni dei tipi (`int`, `long`, puntatori) possono cambiare tra 32 e 64 bit: attenzione quando si scrive codice portabile!

---

## Curiosità

Apple dal 2017 accetta solo app a 64 bit su App Store.  
Android richiede il supporto a 64 bit per tutte le nuove app dal 2019.

---

## Altre Curiosità su Bit, Byte e Architetture

- **Origine del termine "byte"**: Il termine "byte" fu coniato da Werner Buchholz nel 1956 durante lo sviluppo dei primi computer IBM. Inizialmente poteva indicare gruppi di bit di lunghezza variabile, ma oggi indica quasi sempre 8 bit.
- **Perché 1024 e non 1000?**: In informatica, le unità di misura della memoria (KB, MB, GB) sono basate su potenze di 2, quindi 1 KB = 1024 byte (2<sup>10</sup>), non 1000. Tuttavia, nei dischi e nelle memorie commerciali spesso si usa la definizione decimale (1 KB = 1000 byte).
- **Unità IEC**: Per evitare confusione, esistono anche le unità IEC: 1 KiB (kibibyte) = 1024 byte, 1 MiB = 1024 KiB, ecc.

---

- **Overflow**: Se una variabile supera il valore massimo rappresentabile dal suo tipo (ad esempio, un `unsigned int` che va oltre 4.294.967.295), si verifica un "overflow" e il valore riparte da zero.
- **Endianess**: L’ordine in cui i byte vengono memorizzati in memoria può essere "little endian" (il byte meno significativo viene prima) o "big endian" (il più significativo viene prima). Questo può influenzare la portabilità dei dati tra sistemi diversi.
- **Puntatori**: Su architetture a 64 bit, i puntatori occupano 8 byte, mentre su 32 bit ne occupano 4. Questo influisce sulla quantità di memoria usata dai programmi che fanno largo uso di puntatori.
- **Performance**: I programmi compilati per 64 bit possono essere più veloci, ma occupano anche più memoria, soprattutto per strutture dati che contengono molti puntatori.
- **Compatibilità**: Molti sistemi operativi a 64 bit possono eseguire programmi a 32 bit, ma non sempre vale il contrario.

--- 

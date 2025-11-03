---
marp: true
---

# Corso di Programmazione in C

## Lezione 7 — Puntatori

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Capire il concetto di puntatore
- Usare puntatori con variabili, array e funzioni
- Gestire l’aritmetica dei puntatori
- Applicare i puntatori a problemi pratici

---

## Cos’è un Puntatore?

- Variabile che contiene l’indirizzo di memoria di un’altra variabile

### Dichiarazione

```c
int *p;
int a = 10;
p = &a;
```

- `p` è un puntatore a intero
- `&a` prende l’indirizzo di `a`
- `*p` accede al valore puntato

---

## Visualizzazione di un Puntatore

Un puntatore è come un segnaposto che indica dove si trova un valore in memoria.

```
+---------+        +---------+
|   a     |        |   p     |
+---------+        +---------+
|   10    |        | 0x7ffc  | ---> [indirizzo di a]
+---------+        +---------+
```

- `a` contiene il valore `10`
- `p` contiene l’indirizzo di `a` (es: `0x7ffc`)

---

## Diagramma: Puntatore e Valore Puntato

```
+---------+        +---------+
|   a     |        |   p     |
+---------+        +---------+
|   10    |        |  &a     | ---> [indirizzo di a]
+---------+        +---------+
```

- `a` contiene il valore `10`
- `p` contiene l’indirizzo di `a`

---

## Puntatore Nullo

- Un puntatore può non puntare a nulla: si usa il valore speciale `NULL`

```c
int *p = NULL;
```

```
+---------+
|   p     |
+---------+
|  NULL   |
+---------+
```

---

## Differenza tra Puntatore e Valore

- `p` contiene un indirizzo
- `*p` accede al valore all’indirizzo puntato

```c
int a = 20;
int *p = &a;
printf("%p\n", p);   // stampa l’indirizzo di a
printf("%d\n", *p);  // stampa 20
```

---

## Funzione che Incrementa il Valore Puntato

```c
#include <stdio.h>
#include <stdlib.h>

void incremento(int *p){
    (*p)++;

}

int main() {

    int a = 10;
    int *p = &a;

    printf("%d\n", a); // stampa 10
    incremento(p);
    printf("%d\n", a); // stampa 11

    return 0;
}
```

---

## Puntatori e Array

| Indice | Valore | Indirizzo |
| ------ | ------ | --------- |
| arr[0] | 1      | `0x1000`  |
| arr[1] | 2      | `0x1004`  |
| arr[2] | 3      | `0x1008`  |

- `p` punta a `arr[0]` (`p = arr`) mentre `*(p+1)` accede a `arr[1]`

```
+---------+      +---------+      +---------+
| arr[0]  | ---> | arr[1]  | ---> | arr[2]  |
+---------+      +---------+      +---------+
    ^
    |
    p
```

---

## Puntatori Multipli

- Un puntatore può puntare a un altro puntatore

```c
int a = 5;
int *p = &a;
int **pp = &p;
```

```
+-----+      +-----+      +-----+
|  a  |<-----|  p  |<-----| pp  |
+-----+      +-----+      +-----+
|  5  |      | &a  |      | &p  |
+-----+      +-----+      +-----+
```

---

## Esempio di Uso

```c
int x = 5;
int *ptr = &x;
printf("Valore: %d\n", *ptr); // stampa 5
```

---

## Esercizio Pratico 1

Dichiara una variabile intera e un puntatore. Assegna un valore all’intero e stampa il valore usando sia la variabile che il puntatore.

---

## Puntatori e Array

- Il nome dell’array è un puntatore al primo elemento

```c
int arr[3] = {1,2,3};
int *p = arr;
printf("%d", *(p+1)); // stampa 2
```

---

## Esercizio Pratico 2

Scrivi un programma che stampa tutti gli elementi di un array usando i puntatori.

---

## Soluzione Esercizio Pratico 2

```c
#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int *p = arr;

    for (int i = 0; i < 5; i++) {
        printf("%d\n", *(p + i));
        //printf("%d\n", p[i]); //equivalente ?
    }

    return 0;
}
```

---

## Esercizio Pratico 3

Scrivi una funzione che scambia il valore di due variabili intere usando i puntatori.

---

## Passaggio per riferimento alle funzioni

- Passando l’indirizzo di una variabile, si può modificarla dentro la funzione

### Esempio

```c
void scambia(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
```

---

## Domanda da "Milionario dei Puntatori"

È possibile scambiare il valore di due variabili intere usando i puntatori **senza** utilizzare una variabile temporanea (`temp`)? Se sì, come si potrebbe fare? Discutete vantaggi e svantaggi di questa soluzione.

---
### Risposta

Sì, è possibile scambiare il valore di due variabili intere usando i puntatori senza una variabile temporanea, sfruttando l’aritmetica:

```c
void scambia(int *a, int *b) {
    *a = *a + *b;    // *a = valore_a + valore_b
    *b = *a - *b;    // *b = (valore_a + valore_b) - valore_b = valore_a
    *a = *a - *b;    // *a = (valore_a + valore_b) - valore_a = valore_b
}
```
**Svantaggi:**  
- Può causare overflow se i valori sono molto grandi.
- Meno leggibile e più soggetto a errori rispetto all’uso di una variabile temporanea.
- Non funziona correttamente se `a` e `b` puntano allo stesso indirizzo.
- In generale, è preferibile usare una variabile tmp per chiarezza e sicurezza.

---

## Puntatori a funzioni

- Un puntatore può riferirsi a una funzione

```c
int somma(int a, int b){ return a+b; }
int (*pf)(int, int) = somma;
printf("%d", pf(2,3)); // stampa 5
```

---

## Aritmetica dei Puntatori

- Si possono sommare o sottrarre interi a un puntatore per accedere ad altri elementi di array

---

## Esercizio Pratico 4

Scrivi una funzione che inverte un array di N elementi usando i puntatori.

---

## Errori Comuni

- Puntatori non inizializzati
- Accesso a memoria non valida (dangling pointer)
- Dereferenziazione di puntatore nullo

---

## Mini-Challenge

Cosa succede se stampi il valore di un puntatore non inizializzato?

---

### Risposta
Se si stampa il valore di un puntatore non inizializzato, il risultato è indefinito: potrebbe essere un indirizzo casuale, zero, o causare errori di esecuzione. Accedere o dereferenziare un puntatore non inizializzato può portare a crash o comportamenti imprevedibili. È buona pratica inizializzare sempre i puntatori prima dell’uso.
---

## Esercizi di approfondimento

- Dato un array di 10 interi, calcola la somma usando solo puntatori
- Scrivi una funzione che restituisce un puntatore al massimo di un array

---

## Riepilogo della Lezione

- Concetto e uso dei puntatori
- Puntatori e array
- Passaggio per riferimento

---

## Compiti a Casa

- Scrivi una funzione che calcola la lunghezza di una stringa con i puntatori
- Prova a manipolare un array di float usando puntatori

---

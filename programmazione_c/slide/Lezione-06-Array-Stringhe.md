---
marp: true
---

# Corso di Programmazione in C

## Lezione 6 — Array e Stringhe

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Capire cosa sono gli array
- Usare array monodimensionali e bidimensionali
- Gestire stringhe (array di char)
- Applicare funzioni standard per le stringhe

---

## Cos’è un Array?

- Struttura dati che contiene più elementi dello stesso tipo
- Ogni elemento ha un indice (parte da 0)

### Dichiarazione

```c
int numeri[5];
```

---

## Inizializzazione di un Array

```c
int numeri[5] = {1, 2, 3, 4, 5};
```

---

## Accesso agli Elementi

```c
printf("Primo elemento: %d\n", numeri[0]);
numeri[2] = 10;
```

---

## Esercizio Pratico 1

Dichiara un array di 10 interi, assegna valori da 1 a 10 e stampali tutti.

---

## Array e Cicli

- Usare il ciclo for per scorrere gli elementi

### Esempio

```c
for (int i = 0; i < 5; i++) {
    printf("%d\n", numeri[i]);
}
```

---

## Esercizio Pratico 2

Scrivi un programma che chiede 5 numeri all’utente e li memorizza in un array, poi stampa la somma.

---

## Array Multidimensionali (matrici)

- Esempio: matrice 3x3

```c
int matrice[3][3] = {
    {1,2,3},
    {4,5,6},
    {7,8,9}
};
```

- Accesso: `matrice[1][2]` vale 6

---

## Esercizio Pratico 3

Scrivi un programma che chiede all’utente di inserire i valori per una matrice 2x2 e poi ne stampa la trasposta.

---

### Cos'è la trasposta di una matrice?

- La **trasposta** di una matrice si ottiene scambiando le righe con le colonne.
- Se la matrice originale ha elemento in posizione `[i][j]`, nella trasposta si troverà in posizione `[j][i]`.
- Esempio:

  Matrice originale:

  ```
  1 2
  3 4
  ```

  Trasposta:

  ```
  1 3
  2 4
  ```

---

## Esempio: Calcolo della Trasposta di una Matrice 2x2

```c
#include <stdio.h>

int main() {
    int matrice[2][2], trasposta[2][2];

    // Inserimento dei valori
    printf("Inserisci i 4 elementi della matrice 2x2:\n");
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            printf("Elemento [%d][%d]: ", i, j);
            scanf("%d", &matrice[i][j]);
        }
    }

    // Calcolo della trasposta
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            trasposta[j][i] = matrice[i][j];
        }
    }

    // Stampa della trasposta
    printf("Matrice trasposta:\n");
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            printf("%d ", trasposta[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

## Stringhe in C

- Una stringa è un array di char terminato da `\0`

```c
char nome[20] = "Luca";
```

---

## Leggere e Stampare Stringhe

```c
char nome[20];
printf("Inserisci il nome: ");
scanf("%s", nome); // attenzione: non legge gli spazi
printf("Ciao, %s!\n", nome);
```

---

## Leggere una riga intera

- Per leggere una riga intera (compresi gli spazi) si può usare la funzione `fgets`:

```c
char frase[100];
printf("Inserisci una frase: ");
fgets(frase, sizeof(frase), stdin);
printf("Hai scritto: %s", frase);
```

> **Nota:**  
> `fgets` legge fino a una nuova linea (`\n`) o al massimo `sizeof(frase) - 1` caratteri.  
> La stringa letta include il carattere di nuova linea se presente.

---

## Dettaglio della funzione `fgets`

- **Sintassi:**
  ```c
  char *fgets(char *str, int n, FILE *stream);
  ```
- **Parametri:**
  - `str`: array di caratteri dove viene memorizzata la stringa letta
  - `n`: numero massimo di caratteri da leggere (incluso il terminatore `\0`)
  - `stream`: sorgente da cui leggere (es. `stdin` per input da tastiera)
- **Comportamento:**
  - Legge al massimo `n-1` caratteri e aggiunge il terminatore `\0`
  - Si ferma se incontra una nuova linea (`\n`) o la fine del file
  - Restituisce `NULL` in caso di errore o fine file

---

> **Esempio:**
>
> ```c
> char buffer[50];
> if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
>     printf("Hai inserito: %s", buffer);
> }
> ```

---

## Leggere una riga senza dichiarare la lunghezza

- In C99 e successivi, si può usare la funzione `getline` (POSIX) che alloca dinamicamente lo spazio necessario:

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    char *line = NULL;
    size_t len = 0;
    printf("Inserisci una riga: ");
    ssize_t nread = getline(&line, &len, stdin);
    if (nread != -1) {
        printf("Hai scritto: %s", line);
    }
    free(line);
    return 0;
}
```

---

> **Nota:**  
> `getline` alloca (o rialloca) automaticamente la memoria per la stringa letta.  
> È necessario liberare la memoria con `free` dopo l'uso.

---

## Leggere una riga senza dichiarare la lunghezza (versioni precedenti di C)

Nelle versioni di C precedenti a C99, non esiste una funzione standard che alloca dinamicamente la memoria per una riga di input. Tuttavia, si può leggere una riga di lunghezza arbitraria utilizzando un buffer di dimensione prefissata e, se necessario, gestendo manualmente la riallocazione della memoria.

---

### Esempio con `fgets` e buffer statico

```c
#include <stdio.h>

int main() {
    char buffer[1024]; // dimensione massima della riga
    printf("Inserisci una riga: ");
    if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
        printf("Hai scritto: %s", buffer);
    }
    return 0;
}
```

---

> **Nota:**  
> Se la riga supera la dimensione del buffer, viene letta solo la parte che ci sta.  
> Per gestire righe più lunghe, occorre leggere più volte e concatenare i risultati manualmente.

---

## Funzioni standard per le stringhe (`<string.h>`)

> **Nota:**  
> Documentazione delle funzioni standard per la manipolazione delle stringhe in C:
>
> - `size_t strlen(const char *str)`: Restituisce (tipo `size_t`) la lunghezza della stringa `str` (escluso il carattere di terminazione `\0`).
> - `char *strcpy(char *dest, const char *src)`: Restituisce (tipo `char *`) un puntatore alla destinazione `dest` dopo avervi copiato la stringa `src`.
> - `char *strcat(char *dest, const char *src)`: Restituisce (tipo `char *`) un puntatore alla destinazione `dest` dopo avervi concatenato la stringa `src`.
> - `int strcmp(const char *str1, const char *str2)`: Restituisce (tipo `int`) un valore intero che indica il risultato del confronto tra le stringhe `str1` e `str2` (0 se uguali, negativo se `str1` < `str2`, positivo altrimenti).

---

### Esempio

```c
char a[20]="ciao", b[20]="mondo";
strcat(a, b); // a ora è "ciaomondo"
```

---

## Esercizio Pratico 4

Chiedi all’utente due stringhe e stampa la loro concatenazione.

---

## Esercizio Pratico 5

Scrivi un programma che legge una frase (max 50 caratteri) e conta quante vocali contiene.

---

## Esercizi di approfondimento

- Dato un array di 10 numeri, trova il massimo e il minimo
- Leggi una lista di 5 nomi e stampali in ordine inverso
- Verifica se una parola è palindroma (uguale letta da sinistra a destra e viceversa)

---

## Soluzioni agli Esercizi di Approfondimento

### 1. Dato un array di 10 numeri, trova il massimo e il minimo

```c
#include <stdio.h>

int main() {
    int numeri[10];
    printf("Inserisci 10 numeri:\n");
    for (int i = 0; i < 10; i++) {
        scanf("%d", &numeri[i]);
    }
    int max = numeri[0], min = numeri[0];
    for (int i = 1; i < 10; i++) {
        if (numeri[i] > max) max = numeri[i];
        if (numeri[i] < min) min = numeri[i];
    }
    printf("Massimo: %d\nMinimo: %d\n", max, min);
    return 0;
}
```

---

### 2. Leggi una lista di 5 nomi e stampali in ordine inverso

```c
#include <stdio.h>
#include <string.h>

int main() {
    char nomi[5][30];
    printf("Inserisci 5 nomi:\n");
    for (int i = 0; i < 5; i++) {
        scanf("%s", nomi[i]);
    }
    printf("Nomi in ordine inverso:\n");
    for (int i = 4; i >= 0; i--) {
        printf("%s\n", nomi[i]);
    }
    return 0;
}
```

---

### 3. Verifica se una parola è palindroma

```c
#include <stdio.h>
#include <string.h>

int main() {
    char parola[50];
    printf("Inserisci una parola: ");
    scanf("%s", parola);
    int len = strlen(parola);
    int palindroma = 1;
    for (int i = 0; i < len / 2; i++) {
        if (parola[i] != parola[len - 1 - i]) {
            palindroma = 0;
            break;
        }
    }
    if (palindroma)
        printf("La parola è palindroma.\n");
    else
        printf("La parola NON è palindroma.\n");
    return 0;
}
```

## Riepilogo della Lezione

- Dichiarazione e uso degli array
- Gestione delle stringhe
- Funzioni standard di stringa

---

## Compiti a Casa

- Programma che legge 10 numeri e stampa la media
- Programma che legge due stringhe e verifica se sono uguali

---

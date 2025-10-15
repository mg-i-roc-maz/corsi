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

## Riepilogo della Lezione

- Dichiarazione e uso degli array
- Gestione delle stringhe
- Funzioni standard di stringa

---

## Compiti a Casa

- Programma che legge 10 numeri e stampa la media
- Programma che legge due stringhe e verifica se sono uguali

---

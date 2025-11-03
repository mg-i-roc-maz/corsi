---
marp: true
---

# Corso di Programmazione in C

## Lezione 9 — File I/O e Gestione della Memoria Dinamica

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Leggere e scrivere file in C
- Gestire la memoria dinamica (malloc, calloc, free)
- Applicare queste tecniche a problemi pratici

---

## Apertura e chiusura di file

```c
FILE *fp;
fp = fopen("dati.txt", "w"); // scrittura
if (fp == NULL) {
    printf("Errore apertura file\n");
}
fclose(fp);
```

---

## Scrivere su un file

```c
FILE *fp = fopen("output.txt", "w");
fprintf(fp, "Ciao, file!\n");
fclose(fp);
```

---

## Leggere da un file

```c
FILE *fp = fopen("input.txt", "r");
char buffer[100];
fgets(buffer, 100, fp);
printf("%s", buffer);
fclose(fp);
```

---

## Modalità di apertura file

| Tipo                | Testo | Binario |
| ------------------- | ----- | ------- |
| Lettura             | "r"   | "rb"    |
| Scrittura           | "w"   | "wb"    |
| Append              | "a"   | "ab"    |
| Lettura & Scrittura | "r+"  | "rb+"   |
| Scrittura & Lettura | "w+"  | "wb+"   |
| Append & Lettura    | "a+"  | "ab+"   |

---

### Esercizio 1: Conta le righe di un file

Scrivi un programma che apre un file di testo e conta quante righe contiene.

---

### Esercizio 2: Scrittura di una tabella

Chiedi all’utente di inserire una serie di nomi e voti, poi salva questi dati su file in formato tabellare.

---

### Esercizio 3: Lettura e somma di numeri

Leggi da un file una lista di numeri interi (uno per riga) e calcola la loro somma totale.

---

### Esercizio 4: Copia di file

Scrivi un programma che copia il contenuto di un file in un altro file specificato dall’utente.

---

### Esercizio 5: Ricerca di una parola

Scrivi un programma che legge un file di testo e conta quante volte compare una parola inserita dall’utente.

---

## Approfondimento: File header (.h) e modularità

In C è buona pratica separare le dichiarazioni di funzioni, strutture e costanti in file header (`.h`). Questo permette di organizzare meglio il codice e riutilizzare le stesse dichiarazioni in più file sorgente (`.c`).

### Come si crea un file header

1. **Crea un file** con estensione `.h`, ad esempio `miofile.h`.
2. **Inserisci le dichiarazioni** di funzioni, strutture, costanti, macro:

---

```c
#ifndef MIOFILE_H
#define MIOFILE_H

// Dichiarazione di una funzione
void saluta(const char *nome);

// Dichiarazione di una struct
typedef struct {
    char nome[50];
    int voto;
} Studente;

#endif // MIOFILE_H
```

> L’uso di `#ifndef`, `#define`, `#endif` serve a evitare inclusioni multiple dello stesso header (inclusione protetta).

---

### Come si include un file header

Nel file sorgente (`.c`) basta scrivere:

```c
#include "miofile.h"
```

### Esempio pratico

**miofile.h**

```c
#ifndef MIOFILE_H
#define MIOFILE_H

void saluta(const char *nome);

#endif
```

---

**miofile.c**

```c
#include <stdio.h>
#include "miofile.h"

void saluta(const char *nome) {
    printf("Ciao, %s!\n", nome);
}
```

**main.c**

```c
#include "miofile.h"

int main() {
    saluta("Rocco");
    return 0;
}
```

---

### Compilazione

Compila entrambi i file `.c` insieme:

```sh
gcc main.c miofile.c -o programma
```

In questo modo puoi suddividere il codice in più file, rendendolo più leggibile e riutilizzabile.

---

## Gestione della memoria dinamica

### malloc

```c
int *p = (int*)malloc(10 * sizeof(int));
```

> **Nota su `malloc`:**  
> La funzione `malloc` alloca dinamicamente memoria nell'heap e restituisce un puntatore al primo byte dell'area allocata.  
> **Attenzione:** È importante controllare che il puntatore restituito non sia `NULL`, per verificare che l'allocazione sia andata a buon fine.  
> Inoltre, la memoria allocata con `malloc` deve essere liberata con `free` per evitare memory leak.

---

### calloc

```c
int *q = (int*)calloc(10, sizeof(int));
```

> **Nota su `calloc`:**
> La funzione `calloc` alloca memoria per un array di elementi, inizializzando tutti i byte a zero.
> Anche in questo caso, è fondamentale verificare che il puntatore restituito non sia `NULL` e liberare la memoria con `free` quando non serve più.

> **Differenza tra `malloc` e `calloc`:**
>
> - `malloc` alloca un blocco di memoria di una certa dimensione ma non inizializza il contenuto (i valori sono indefiniti).
> - `calloc` alloca memoria per un array di elementi e inizializza tutti i byte a zero.

---

### free

```c
free(p);
```

> **Nota su `free`:**  
> La funzione `free` dealloca la memoria precedentemente allocata con `malloc` o `calloc`.  
> È importante chiamare `free` per ogni blocco di memoria allocato dinamicamente per evitare memory leak.  
> Non chiamare `free` su un puntatore che non è stato allocato dinamicamente o che è già stato liberato.

---

## Esercizio Pratico 2

Chiedi all’utente quanti numeri vuole inserire, alloca dinamicamente l’array, leggi i numeri, calcola e stampa la media.

---

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, i;
    float *numeri, somma = 0, media;

    printf("Quanti numeri vuoi inserire? ");
    scanf("%d", &n);

    numeri = (float*)malloc(n * sizeof(float));
    if (numeri == NULL) {
        printf("Errore di allocazione memoria.\n");
        return 1;
    }

    for (i = 0; i < n; i++) {
        printf("Inserisci il numero %d: ", i + 1);
        scanf("%f", &numeri[i]);
        somma += numeri[i];
    }

    media = somma / n;
    printf("La media è: %.2f\n", media);

    free(numeri);
    return 0;
}
```

---

## Errori comuni

- Dimenticare di chiudere il file (fclose)
- Non controllare se malloc/calloc restituisce NULL
- Non liberare la memoria (no free)

---

## Mini-Challenge

Cosa succede se provi a scrivere su un file aperto in sola lettura?

> Se provi a scrivere su un file aperto in sola lettura (`"r"`), la funzione di scrittura (`fprintf`, `fputs`, ecc.) fallirà e non verrà scritto nulla.  
> In genere, queste funzioni restituiscono un valore negativo o zero per indicare l’errore.  
> È buona pratica controllare il valore di ritorno delle funzioni di scrittura e gestire eventuali errori.

---

## Esercizio Pratico 3

Scrivi un programma che salva su file i dati di una struct Studente (nome, voto) e poi li rilegge.

---

## Esercizi di approfondimento

- Programma che copia il contenuto di un file in un altro
- Gestione dinamica di una rubrica di N persone (struct + malloc)

---

## Riepilogo della Lezione

- Uso di file in C (fopen, fclose, fprintf, fscanf, fgets)
- Allocazione e liberazione memoria dinamica

---

## Compiti a Casa

- Programma che legge da file una lista di numeri e stampa il totale
- Programma che alloca dinamicamente un array di stringhe e le stampa

---

# Approfondimenti - organizzazione dei progetti in C

In C è buona pratica organizzare il codice in più file per migliorare la leggibilità e la manutenibilità. Ecco alcune linee guida:

1. **File Header (.h)**: Contengono dichiarazioni di funzioni, strutture, costanti e macro. Vengono inclusi nei file sorgente che ne hanno bisogno.
2. **File Sorgente (.c)**: Contengono l'implementazione delle funzioni dichiarate negli header. Ogni file sorgente può includere uno o più file header.
3. **Compilazione**: I file sorgente vengono compilati insieme per creare l'eseguibile finale. Ad esempio, `gcc main.c utils.c -o programma`.

---

## Struttura delle cartelle di un progetto C

Per mantenere il progetto ordinato, è consigliabile suddividere i file in cartelle dedicate:

- **src/**: contiene i file sorgente `.c`
- **include/**: contiene i file header `.h`
- **bin/**: (opzionale) contiene gli eseguibili compilati
- **data/**: (opzionale) contiene file di dati o di input/output

---

### Esempio di struttura

```
mio_progetto/
├── src/
│   ├── main.c
│   └── utils.c
├── include/
│   └── utils.h
├── bin/
└── data/
```

### Compilazione con cartelle

Per compilare un progetto strutturato in questo modo:

```sh
gcc src/main.c src/utils.c -Iinclude -o bin/mio_programma
```

L'opzione `-Iinclude` dice al compilatore di cercare i file header anche nella cartella `include/`.

---

### Compilazione con cartelle

Organizzare i file in cartelle facilita la gestione di progetti più grandi e la collaborazione in team.

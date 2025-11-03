---
marp: true
---

# Corso di Programmazione in C

## Lezione 8 — Strutture, Unioni, Enum

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Definire e utilizzare strutture (struct)
- Comprendere unioni e enumerazioni (enum)
- Applicare queste strutture a problemi pratici

---

## Strutture (struct)

- Raggruppano variabili di tipo diverso sotto un unico nome

### Dichiarazione

```c
struct Persona {
    char nome[20];
    int eta;
};
```

---

### Uso di una struct

```c
struct Persona p1;
strcpy(p1.nome, "Luca");
p1.eta = 30;
```

---

## Esercizio Pratico 1

Definisci una struct Studente con nome, cognome e voto.  
Chiedi i dati all’utente e stampali.

---

## Array di strutture

```c
struct Persona rubrica[5];
```

- Si accede come: `rubrica[0].eta = 25;`

---

## Puntatori a struct

- È possibile creare puntatori a strutture per gestire i dati in modo più flessibile.

### Dichiarazione e utilizzo

```c
struct Persona p1;
struct Persona *ptr = &p1;

strcpy(ptr->nome, "Anna");
ptr->eta = 28;
```

- Si accede ai membri tramite l’operatore `->` (freccia).
- L’operatore `.` si usa con variabili, `->` con puntatori.

---

## Esercizio Pratico 2

Crea una rubrica di 3 persone e stampa i dati di tutti.

---

## Strutture annidate

```c
struct Data { int giorno, mese, anno; };
struct Persona {
    char nome[20];
    struct Data nascita;
};
```

---

## Unioni (union)

- Occupano memoria solo per il campo più grande

```c
union Dato {
    int i;
    float f;
    char c;
};
```

---

### Dettagli sulle unioni

- In una union, tutti i membri condividono la stessa area di memoria.
- Solo uno dei membri può contenere un valore valido in un dato momento.
- La dimensione di una union è determinata dal membro più grande.
- Utili quando una variabile può assumere tipi diversi in momenti diversi.
- L'accesso errato a un membro diverso da quello assegnato può portare a risultati imprevedibili.

#### Esempio di utilizzo

```c
union Dato d;
d.i = 42;
printf("%d\n", d.i); // Corretto
d.f = 3.14;
printf("%f\n", d.f); // Ora il valore di d.i non è più valido
```

---

## Esercizio Pratico 3

Dichiara una union Dato, assegna e stampa valori diversi.

---

## Enum (enumerazioni)

- Definiscono nomi per valori interi costanti

```c
enum Giorno { LUN, MAR, MER, GIO, VEN, SAB, DOM };
enum Giorno oggi = MER;
```

---

## Dettagli sulle enum in C

Un'enumerazione (enum) in C è un tipo di dato definito dall'utente che consiste in un insieme di costanti con nome, chiamate enumeratori. Gli enum vengono utilizzati per rappresentare valori discreti e leggibili, migliorando la chiarezza e la manutenibilità del codice.

### Caratteristiche principali

- Gli enum sono dichiarati usando la parola chiave `enum`.
- Ogni enumeratore ha un valore intero associato, che per default parte da 0 e aumenta di 1 per ciascun elemento successivo, ma può essere assegnato esplicitamente.
- Gli enum migliorano la leggibilità del codice rispetto all'uso di semplici costanti numeriche.
- Sono tipicamente utilizzati per rappresentare stati, opzioni o insiemi di valori correlati.

---

### Esempio di dichiarazione

```c
enum GiornoDellaSettimana {
    LUNEDI,    // 0
    MARTEDI,   // 1
    MERCOLEDI, // 2
    GIOVEDI,   // 3
    VENERDI,   // 4
    SABATO,    // 5
    DOMENICA   // 6
};
```

---

### Assegnazione di valori specifici

```c
enum Stato {
    INIZIO = 1,
    IN_CORSO = 5,
    FINE = 10
};
```

---

### Dichiarazione di variabili enum

```c
enum GiornoDellaSettimana oggi = LUNEDI;
```

---

## Esempi di utilizzo delle enum

### Esempio 1: Uso in una struttura di controllo

```c
enum Semaforo { ROSSO, GIALLO, VERDE };

void azioneSemaforo(enum Semaforo stato) {
    switch (stato) {
        case ROSSO:
            printf("Fermati\n");
            break;
        case GIALLO:
            printf("Preparati a partire\n");
            break;
        case VERDE:
            printf("Vai\n");
            break;
    }
}
```

---

### Esempio 2: Array indicizzato da enum

```c
enum Giorno { LUN, MAR, MER, GIO, VEN, SAB, DOM };
const char* nomiGiorni[] = {
    "Lunedì", "Martedì",
    "Mercoledì", "Giovedì",
    "Venerdì", "Sabato", "Domenica"
};

enum Giorno oggi = VEN;
printf("Oggi è %s\n", nomiGiorni[oggi]);
```

---

### Esempio 3: Uso per rappresentare stati

```c
enum StatoConnessione { DISCONNESSO, CONNESSO, IN_ATTESA };

enum StatoConnessione stato = CONNESSO;
if (stato == CONNESSO) {
    printf("Connessione attiva\n");
}
```

---

## Typedef

### Uso di typedef

Il costrutto `typedef` permette di creare un alias per un tipo di dato, semplificando la dichiarazione delle variabili.

#### Esempio di typedef su variabili

```c
typedef unsigned int uint;

uint a = 10;
printf("%u\n", a);
```

In questo esempio, `uint` diventa un alias per `unsigned int`, rendendo il codice più leggibile.

---

## Esempio di utilizzo di struct con typedef

```c
#include <stdio.h>
#include <string.h>

typedef struct {  char nome[20]; int eta; } Persona;

int main() {
    Persona p;

    strcpy(p.nome, "Giulia");
    p.eta = 27;

    printf("Nome: %s\n", p.nome);
    printf("Età: %d\n", p.eta);
    return 0;
}
```

Nell'esempio viene utilizzato `typedef` per creare un alias del tipo `struct Persona`, semplificando la dichiarazione delle variabili.

---

## Esercizi di approfondimento

- Struct Libro con titolo, autore, anno; gestisci un array di 5 libri
- Struct Rettangolo con base e altezza, funzione che calcola area e perimetro

---

## Riepilogo della Lezione

- Strutture, unioni, enum
- Array e annidamento di struct

---

## Compiti a Casa

- Crea una struct Automobile con marca, modello e anno; chiedi i dati e stampali
- Enum per i giorni della settimana, stampa il nome del giorno dato il numero

---

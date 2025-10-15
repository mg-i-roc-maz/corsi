---
marp: true
---

# Corso di Programmazione in C

## Lezione 3 — Strutture di controllo: if, else, switch

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Capire come si controlla il flusso di esecuzione di un programma
- Usare if, else if, else per prendere decisioni
- Comprendere e utilizzare switch-case
- Applicare logica condizionale a problemi pratici

---

## Struttura if

### Cos'è l'istruzione if?

L'istruzione `if` permette di eseguire un blocco di codice solo se una certa condizione è vera. È fondamentale per prendere decisioni nei programmi.

- **Condizione**: un'espressione che viene valutata come vera (`true`) o falsa (`false`)
- Se la condizione è vera, il codice all'interno delle parentesi graffe viene eseguito
- Se la condizione è falsa, il blocco viene saltato

L'`if` consente di controllare il flusso del programma in base ai dati e alle scelte dell'utente.

---

### Sintassi base

```c
if (condizione) {
    // istruzioni se la condizione è vera
}
```

<table>
    <tr>
        <td width="60%" valign="top">

<b>Esempio</b>

```c
int eta = 20;
if (condizione) {
        // istruzioni se la condizione è vera
}
```

</td>
<td width="50%" valign="top">

<b>Esempio</b>

```c
int eta = 20;
if (eta >= 18) {
        printf("Sei maggiorenne\n");
}
```

</td>
    </tr>
</table>

---

## Attenzione: parentesi graffe mancanti

Se si omettono le parentesi graffe `{}` dopo un `if`, solo la prima istruzione viene considerata parte del blocco condizionale. Questo può portare a errori difficili da individuare.

**Esempio di errore:**

```c
int eta = 17;
if (eta >= 18)
    printf("Sei maggiorenne\n");
    printf("Benvenuto!\n");
```

In questo esempio, `printf("Benvenuto!\n");` viene sempre eseguito, indipendentemente dalla condizione, perché non è racchiuso tra parentesi graffe.

---

**Corretto:**

```c
int eta = 17;
if (eta >= 18) {
    printf("Sei maggiorenne\n");
    printf("Benvenuto!\n");
}
```

---

## if-else e else if

<div style="display: flex; gap: 2em;">
  <div style="flex: 1;">
 Sintassi

```c
if (condizione1) {
    // blocco 1
} else if (condizione2) {
    // blocco 2
} else {
    // blocco alternativo
}
```

  </div>
  <div style="flex: 1;">
    Esempio

```c
int numero = 0;
if (numero > 0) {
    printf("Positivo\n");
} else if (numero < 0) {
    printf("Negativo\n");
} else {
    printf("Zero\n");
}
```

  </div>
</div>

---

## Esercizio Pratico 1

Scrivi un programma che chiede l’età all’utente e stampa se è minorenne, maggiorenne o pensionato (>= 67 anni).

---

## Operatori logici nelle condizioni

- **&&** (AND): tutte le condizioni devono essere vere
- **||** (OR): almeno una condizione deve essere vera
- **!** (NOT): nega la condizione

### Esempio

```c
int a = 5, b = 10;
if (a > 0 && b > 0) {
    printf("Entrambi positivi\n");
}
```

---

## Esercizio Pratico 2

Scrivi un programma che chiede due numeri e verifica:

- se entrambi sono positivi
- se almeno uno è maggiore di 100

---

## Annidamento di if

### Esempio

```c
int voto = 85;
if (voto >= 60) {
    if (voto >= 90) {
        printf("Ottimo\n");
    } else {
        printf("Sufficiente\n");
    }
} else {
    printf("Insufficiente\n");
}
```

---

## Esercizio Pratico

Scrivi un programma che chiede all’utente se preferisce pizza, pasta o gelato (inserendo una delle tre parole) e risponde con un messaggio diverso per ogni scelta usando if-else. Se l’utente inserisce altro, stampa “Scelta interessante!”.

Se sceglie pizza chiedere se con o senza funghi e rispondere di conseguenza, mentre se sceglie gelato chiedere se alla fragola o al cioccolato e rispondere di conseguenza.

p: preferisci pizza, pasta o gelato?
u: pizza
p: con o senza funghi?
u: con
p: la pizza con funghi è deliziosa!

---

## Diagramma di flusso: Scelta tra pizza, pasta o gelato

```
Inizio
    |
    v
Chiedi: "Preferisci pizza, pasta o gelato?"
    |
    +-- pizza --> Chiedi: "Con o senza funghi?"
    |               |
    |               +-- con ------> "La pizza con funghi è deliziosa!"
    |               |
    |               +-- senza ----> "La pizza senza funghi è ottima!"
    |
    +-- pasta --------------------> "La pasta è sempre una buona scelta!"
    |
    +-- gelato --> Chiedi: "Alla fragola o al cioccolato?"
    |               |
    |               +-- fragola --> "Il gelato alla fragola è fresco!"
    |               |
    |               +-- cioccolato -> "Il gelato al cioccolato è goloso!"
    |
    +-- altro --------------------> "Scelta interessante!"
```

---

## switch-case

### Quando si usa?

- Selezionare tra più alternative numeriche o carattere

### Sintassi

```c
switch (variabile) {
    case valore1:
        // istruzioni
        break;
    case valore2:
        // istruzioni
        break;
    default:
        // istruzioni
}
```

---

### Esempio

```c
int giorno = 3;
switch (giorno) {
    case 1: printf("Lunedì\n"); break;
    case 2: printf("Martedì\n"); break;
    case 3: printf("Mercoledì\n"); break;
    default: printf("Altro giorno\n");
}
```

---

## Esercizio Pratico (versione switch)

Scrivi un programma che chiede all’utente se preferisce pizza, pasta o gelato (inserendo una delle tre parole) e risponde con un messaggio diverso per ogni scelta usando `switch`. Se l’utente inserisce altro, stampa “Scelta interessante!”.

Se sceglie pizza chiedere se con o senza funghi e rispondere di conseguenza, mentre se sceglie gelato chiedere se alla fragola o al cioccolato e rispondere di conseguenza, sempre usando `switch` dove possibile.

---

## Esercizio Pratico 3

Scrivi un programma che chiede all’utente un numero da 1 a 7 e stampa il giorno della settimana corrispondente.

---

## Errori comuni

- Dimenticare il break (il programma esegue tutti i casi successivi!)
- Usare switch con condizioni complesse (usa solo valori costanti)

---

### Mini-Challenge

Cosa stampa questo programma?

```c
int x = 2;
switch (x) {
    case 1: printf("Uno\n");
    case 2: printf("Due\n");
    case 3: printf("Tre\n"); break;
    default: printf("Altro\n");
}
```

---

## Esercizio Pratico 4

Scrivi un programma che chiede all’utente il voto (0-10) e stampa una valutazione:

- 9-10: Eccellente
- 7-8: Buono
- 6: Sufficiente
- <6: Insufficiente

---

## Esercizio Pratico 5

Scrivi un programma che chiede il mese (numero 1-12) e stampa quanti giorni ha quel mese (ignorando gli anni bisestili).

---

## Esercizio Pratico Avanzato

Scrivi un programma che chiede all’utente di inserire tre numeri interi e determina:

- Se tutti e tre sono uguali, stampa "Tutti uguali".
- Se solo due sono uguali, stampa "Due numeri uguali".
- Se sono tutti diversi, stampa "Tutti diversi".
- In seguito, usando uno `switch`, stampa quale dei tre numeri è il maggiore (se ci sono più numeri maggiori uguali, stampa "Più numeri sono i maggiori").
- Utilizza sia `if-else` che `switch` per risolvere il problema.

---

## Esercizio Pratico Avanzato 2

Scrivi un programma che chiede all’utente di inserire un numero intero tra 1 e 10 e stampa il suo nome in italiano (ad esempio: 1 → "uno", 2 → "due", ecc.) usando solo strutture `if-else` annidate, **senza usare cicli**.

- Se il numero non è compreso tra 1 e 10, stampa un messaggio di errore.

---

## Esercizio Pratico Avanzato 3

Scrivi un programma che chiede all’utente di inserire:

- un numero intero (int)
- un numero con la virgola (float)
- un numero decimale doppia precisione (double)

Il programma deve:

1. Verificare con `if-else` quale dei tre numeri è il maggiore e stampare un messaggio.
2. Usare uno `switch` sull’intero per:
   - Stampare "Numero pari" se è pari, "Numero dispari" se è dispari (usa `switch (intero % 2)`).
   - Se il numero è negativo, stampare "Numero negativo" (gestisci con un caso `default`).

---

## Esercizio Pratico Avanzato 3

3. Se il float è maggiore di 100.0, stampa "Float grande", altrimenti "Float piccolo".
4. Se il double è compreso tra 0.0 e 1.0 (estremi inclusi), stampa "Double frazionario", altrimenti "Double fuori intervallo".

Suggerimento: usa sia `if-else` che `switch` e stampa i risultati in modo chiaro.

---

## Esercizi di approfondimento

- Programma che chiede un carattere e verifica se è una vocale o una consonante (usa switch)
- Programma che chiede un anno e stampa se è bisestile

---
## Esercizio Pratico Divertente (Livello Avanzato)

Scrivi un programma che chiede all’utente di inserire **due linguaggi di programmazione** tra "C", "Python", "Java" o "JavaScript" (puoi chiedere due volte o accettare una stringa separata da virgola). Il programma deve:

1. Per ciascun linguaggio inserito, stampare un messaggio simpatico diverso, ad esempio:
    - "C: Il classico intramontabile!"
    - "Python: Il serpente più amato dagli sviluppatori!"
    - "Java: Sempre pronto per un caffè!"
    - "JavaScript: Il re del web!"
2. Se uno dei linguaggi non è tra quelli proposti, stampa "Ottima scelta, ogni linguaggio ha il suo fascino!" per quel linguaggio.
3. Se i due linguaggi sono **uguali**, stampa anche "Hai scelto lo stesso linguaggio due volte, la passione si vede!"
4. Se i due linguaggi sono **diversi**, stampa un messaggio che li confronta, ad esempio:
    - "C e Python: dal classico all’innovazione!"
    - "Java e JavaScript: attenzione a non confonderli!"
    - "Python e JavaScript: perfetti per il web moderno!"
    - (Puoi aggiungere altri confronti a piacere, oppure stampare un messaggio generico se la combinazione non è tra quelle elencate.)

Suggerimento: usa sia `if-else` che `switch` per gestire i messaggi e i confronti tra linguaggi.


## Riepilogo della Lezione

- Strutture condizionali if, else if, else
- Uso di operatori logici nelle condizioni
- Struttura e uso di switch-case
- Errori comuni

---

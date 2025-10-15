---
marp: true
---

# Corso di Programmazione in C

## Lezione 4 — Strutture di controllo: cicli (for, while, do-while)

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Comprendere il concetto di ciclo (loop)
- Usare i cicli for, while e do-while
- Gestire break e continue
- Applicare i cicli a problemi pratici

---

## Il ciclo for

### Sintassi

```c
for (inizializzazione; condizione; aggiornamento) {
    // istruzioni
}
```

### Esempio

```c
for (int i = 0; i < 5; i++) {
    printf("i = %d\n", i);
}
```

---

## Sequenza di esecuzione del ciclo for

1. **Inizializzazione**: viene eseguita una sola volta, all'inizio del ciclo.
2. **Controllo della condizione**: se la condizione è vera, si entra nel ciclo; se è falsa, il ciclo termina.
3. **Esecuzione del blocco di istruzioni**: il corpo del ciclo viene eseguito.
4. **Aggiornamento**: viene eseguita l’istruzione di aggiornamento (ad esempio, incremento della variabile di controllo).
5. Si torna al punto 2.

```plaintext
    A[Inizializzazione] --> B{Condizione}
    B -- No --> F[Fine ciclo]
    B -- Sì --> C[Istruzioni]
    C --> D[Aggiornamento]
    D --> B
```

---

## Esercizio Pratico 1

- Scrivi un programma che stampa i numeri da 1 a 10.
- Scrivi un programma che stampa i numeri da 10 a 0.
- Scrivi un programma che stampa i numeri da -10 a 10.

---

## Il ciclo while

### Sintassi

```c
while (condizione) {
    // istruzioni
}
```

### Esempio

```c
int i = 1;
while (i <= 5) {
    printf("%d\n", i);
    i++;
}
```

---

## Curiosità sul ciclo for

- In C, tutte le parti del ciclo for sono opzionali: puoi omettere inizializzazione, condizione o aggiornamento.
- Puoi scrivere un ciclo infinito con `for(;;) { ... }`.
- È possibile usare più variabili di controllo separandole con la virgola.

### Esempi creativi

```c
// Ciclo for senza corpo: somma i numeri da 1 a 100
int sum = 0;
for (int i = 1; i <= 100; sum += i++);

// Ciclo for con più variabili
for (int i = 0, j = 10; i < j; i++, j--) {
    printf("i = %d, j = %d\n", i, j);
}
```

---

## Utilizzi del ciclo for

- **Animazioni/test grafici**: usare il ciclo for per generare pattern o animazioni in console.
- **Inizializzazione di array**: riempire array con valori calcolati.
- **Controllo di più condizioni**: gestire più variabili di controllo contemporaneamente.
- **Cicli "vuoti"**: eseguire solo aggiornamenti o effetti collaterali nell'intestazione del ciclo.

```c
// Esempio: stampa una piramide di asterischi
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        printf("*");
    }
    printf("\n");
}
```

---

## Il ciclo do-while

### Sintassi

```c
do {
    // istruzioni
} while (condizione);
```

### Esempio

```c
int i = 1;
do {
    printf("%d\n", i);
    i++;
} while (i <= 5);
```

---

## Sequenza di esecuzione del ciclo do-while

1. **Esecuzione del blocco di istruzioni**: il corpo del ciclo viene eseguito almeno una volta.
2. **Controllo della condizione**: se la condizione è vera, si ripete il ciclo; se è falsa, il ciclo termina.

```plaintext
    A[Istruzioni] --> B{Condizione}
    B -- Sì --> A
    B -- No --> C[Fine ciclo]
```

---

## Utilizzi creativi del ciclo do-while

- **Menu interattivi**: ripetere la visualizzazione di un menu finché l’utente non sceglie di uscire.
- **Validazione input**: chiedere all’utente di inserire un valore valido almeno una volta.
- **Loop di gioco**: mantenere attivo un gioco finché il giocatore non decide di terminare.

### Esempio: menu semplice

```c
int scelta;
do {
    printf("1. Opzione A\n2. Opzione B\n0. Esci\nScegli: ");
    scanf("%d", &scelta);
    // gestisci la scelta
} while (scelta != 0);
```

---

## Differenze tra for, while, do-while

- for: quando sai quante volte ripetere
- while: quando non sai quante volte, ma dipende da una condizione
- do-while: il ciclo viene eseguito almeno una volta

---

## Esercizio Pratico 2

Scrivi un programma che chiede un numero N e poi stampa tutti i numeri da 1 a N che sono multipli di 3 oppure di 5. Alla fine, il programma deve anche stampare quanti numeri sono stati stampati.

---

## Esercizio Pratico 3

Scrivi un programma che chiede numeri all’utente finché non inserisce 0. Alla fine, il programma deve stampare:

- quanti numeri sono stati inseriti (escludendo lo zero finale)
- quanti di questi numeri erano positivi e quanti negativi
- la somma totale dei numeri inseriti (escludendo lo zero)

(Usa un ciclo while)

---

## Uso di break e continue

### break: interrompe il ciclo

```c
for (int i = 1; i <= 10; i++) {
    if (i == 5) break;
    printf("%d\n", i);
}
```

### continue: salta alla prossima iterazione

```c
for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;
    printf("%d\n", i);
}
```

---

## Sequenza di esecuzione con break e continue

### Con `break`

1. **Inizializzazione** (se presente)
2. **Controllo della condizione**
3. **Esecuzione del blocco di istruzioni**
4. **Se viene eseguito `break`, il ciclo termina immediatamente**
5. **Altrimenti, aggiornamento** (se presente)
6. Si torna al controllo della condizione

```plaintext
    A[Inizializzazione] --> B{Condizione}
    B -- No --> F[Fine ciclo]
    B -- Sì --> C[Istruzioni]
    C -- break --> F
    C -- no break --> D[Aggiornamento]
    D --> B
```

---

### Con `continue`

1. **Inizializzazione** (se presente)
2. **Controllo della condizione**
3. **Esecuzione del blocco di istruzioni**
4. **Se viene eseguito `continue`, si salta il resto del blocco e si passa direttamente all’aggiornamento**
5. **Aggiornamento** (se presente)
6. Si torna al controllo della condizione

```plaintext
    A[Inizializzazione] --> B{Condizione}
    B -- No --> F[Fine ciclo]
    B -- Sì --> C[Istruzioni]
    C -- continue --> D[Aggiornamento]
    C -- no continue --> D
    D --> B
```

---

## Mini-Challenge

Cosa stampa questo programma?

```c
int i = 0;
while (i < 5) {
    i++;
    if (i == 3) continue;
    printf("%d ", i);
}
```

---

## Esercizio Pratico 4

Scrivi un programma che stampa tutti i numeri pari da 1 a 50.

---

## Esercizio Pratico 5

Scrivi un programma che chiede numeri all’utente e calcola la somma finché non viene inserito un numero negativo.

---

## Esercizio Pratico 6 (Avanzato)

Scrivi un programma che calcola il fattoriale di un numero intero positivo inserito dall’utente (usa for o while).

### Formula del fattoriale

Il fattoriale di un numero intero positivo $n$ si indica con $n!$ ed è definito come:

$$
n! = n \times (n-1) \times (n-2) \times \ldots \times 2 \times 1
$$

Per convenzione, $0! = 1$.

---

### Esempio con ciclo for

```c
int n, fattoriale = 1;
printf("Inserisci un numero intero positivo: ");
scanf("%d", &n);

for (int i = 1; i <= n; i++) {
    fattoriale *= i;
}
printf("Il fattoriale di %d è %d\n", n, fattoriale);
```

### Esempio con ciclo while

```c
int n, fattoriale = 1, i = 1;
printf("Inserisci un numero intero positivo: ");
scanf("%d", &n);

while (i <= n) {
    fattoriale *= i;
    i++;
}
printf("Il fattoriale di %d è %d\n", n, fattoriale);
```

---

## Esercizi di approfondimento

- Programma che stampa la tabellina di un numero scelto dall’utente
- Programma che chiede una password e permette di riprovare al massimo 3 volte (do-while)

---

## Esercizio

Scrivi un programma che stampa una "scala" di numeri come questa, usando i cicli:

```
1
12
123
1234
12345
```

(Suggerimento: usa due cicli annidati)

## Riepilogo della Lezione

- Strutture di ciclo for, while, do-while
- Uso di break e continue
- Applicazione dei cicli a problemi pratici

---

## Compiti a Casa

- Scrivi un programma che calcola la somma dei primi N numeri naturali (N inserito dall’utente)
- Programma che chiede 10 numeri e stampa il maggiore e il minore

---

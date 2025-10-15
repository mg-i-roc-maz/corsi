---
marp: true
---

# Corso di Programmazione in C

## Lezione 5 — Funzioni

```c
/**
 * @author Rocco Mazzeo
 * @email rocco.mazzeo@gmail.com
 * @linkedin https://www.linkedin.com/in/roccomazzeo
 */
```

---

## Obiettivi della Lezione

- Comprendere il concetto di funzione
- Imparare a dichiarare, definire e utilizzare funzioni
- Capire il passaggio di parametri e il valore di ritorno
- Applicare le funzioni per organizzare il codice

---

## Cos’è una Funzione?

- Un blocco di codice con un nome che svolge un compito specifico
- Permette di suddividere il programma in parti riutilizzabili

### Esempio

```c
int somma(int a, int b) {
    return a + b;
}
```

---

## Sintassi di una Funzione

```c
tipo_di_ritorno nome_funzione(tipo1 parametro1, tipo2 parametro2, ...) {
    // corpo della funzione
    return valore;
}
```

---

## Chiamare una Funzione

```c
int risultato = somma(10, 5);
printf("Risultato: %d\n", risultato);
```

---

## Funzioni senza parametri e senza valore di ritorno

```c
void saluta() {
    printf("Ciao!\n");
}
```

Chiamata:

```c
saluta();
```

---

## Esercizio Pratico 1

Scrivi una funzione che stampa una riga di asterischi (`*********`)  
Chiamala 3 volte dal main.

---

## Passaggio di Parametri (by value)

- I parametri sono copiati nella funzione
- Le modifiche interne non alterano i valori originali

### Esempio

```c
void raddoppia(int x) { x = x * 2; }
int main() {
    int numero = 5;
    raddoppia(numero);
    printf("Dopo la funzione: %d\n", numero); // Stampa ancora 5
    return 0;
}
```

In questo esempio, il valore di `numero` non cambia dopo la chiamata a `raddoppia`, perché il parametro viene passato per valore (viene fatta una copia).

---

## Valore di ritorno

- Una funzione può restituire un valore col comando `return`
- Tipo di ritorno deve essere dichiarato

---

## Funzioni e Scope delle Variabili

- Le variabili dichiarate dentro una funzione sono locali
- Non sono visibili fuori dalla funzione

---

## Funzioni e Scope delle Variabili

Scope delle variabili:

- Le variabili dichiarate all'interno di una funzione hanno scope locale e sono accessibili solo all'interno di quella funzione.
- Le variabili dichiarate all'esterno di tutte le funzioni (variabili globali) sono accessibili da qualsiasi punto del file.
- Le variabili dichiarate come static all'interno di una funzione mantengono il loro valore tra le chiamate, ma sono visibili solo all'interno della funzione stessa.
- Le variabili statiche a livello di file sono visibili solo all'interno di quel file (file scope).

---

## Convenzioni - Scope delle Variabili

Convenzioni sui nomi in C:

- Utilizzare lettere minuscole separate da underscore per i nomi delle variabili (es: my_variable).
- Utilizzare lettere maiuscole separate da underscore per le costanti (es: MAX_SIZE).
- I nomi delle funzioni dovrebbero essere descrittivi e seguire la convenzione lower_snake_case (es: calculate_sum).
- Evitare nomi troppo brevi o poco descrittivi.
- Le variabili globali dovrebbero essere prefissate per indicare il loro ambito (es: g_counter per una variabile globale).

---

## Esercizio Pratico 2

Scrivi una funzione che riceve due numeri e restituisce il maggiore tra i due.

---

## Funzioni Ricorsive

- Una funzione che si richiama da sola

---

### Caratteristiche delle funzioni ricorsive

- Ogni chiamata ricorsiva crea una nuova istanza della funzione con i propri parametri e variabili locali.
- È fondamentale definire una **condizione di terminazione** (caso base) per evitare chiamate infinite.
- La ricorsione può essere diretta (la funzione chiama sé stessa) o indiretta (due o più funzioni si chiamano a vicenda).
- La ricorsione è spesso usata per risolvere problemi che possono essere suddivisi in sottoproblemi simili all’originale (es. fattoriale, Fibonacci, ricerca binaria).

---

### Esempio: Fattoriale

```c
int fattoriale(int n) {
    if (n == 0) return 1;
    else return n * fattoriale(n-1);
}
```

---

## Esercizio Pratico 3

Scrivi una funzione ricorsiva che calcola la potenza (base^esponente).

---

### Soluzione: Potenza Ricorsiva

```c
int potenza(int base, int esponente) {
    if (esponente == 0)
        return 1;
    else
        return base * potenza(base, esponente - 1);
}
```

Esempio d'uso:

```c
int risultato = potenza(2, 3); // risultato = 8
```

---

## Esercizio Pratico 4

Scrivi una funzione ricorsiva che, data una stringa e la sua lunghezza, conta il numero di vocali presenti nella stringa.

---

## Esercizio Pratico 5

Scrivi una funzione che calcola la media di un array di numeri (passa array e dimensione come parametri).

---

## Esercizio Pratico 6

Scrivi una funzione che riceve un array di interi e la sua dimensione, e restituisce il valore massimo trovato nell’array. Scrivi un’altra funzione che restituisce il valore minimo.

Esempio di prototipi:

```c
int trova_max(int arr[], int dim);
int trova_min(int arr[], int dim);
```

Chiamale dal main e stampa i risultati.

---

## Esercizi di approfondimento

- Funzione che restituisce vero se un numero è pari
- Funzione che converte euro in dollari (tasso come parametro)
- Funzione che stampa i numeri da 1 a N (N parametro)

---

## Riepilogo della Lezione

- Dichiarazione e uso delle funzioni
- Parametri, valore di ritorno, scope
- Ricorsione

---

## Compiti a Casa

- Scrivi una funzione che restituisce il valore assoluto di un numero
- Prova a scrivere una funzione che, data una stringa, conta le vocali

---

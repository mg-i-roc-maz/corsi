# Test di Controllo - Programmazione C

## Domande a Risposta Multipla

1. Quale di questi tipi di dato rappresenta un intero in C?

   - a) float
   - b) int
   - c) char
   - d) double

2. Quale simbolo si usa per il commento su una sola riga in C?

   - a) //
   - b) #
   - c) --
   - d) /\* \*/

3. Quale funzione stampa a schermo in C?

   - a) print()
   - b) printf()
   - c) echo()
   - d) show()

4. Quale parola chiave si usa per dichiarare una costante?

   - a) constant
   - b) define
   - c) const
   - d) static

5. Quale operatore serve per assegnare un valore a una variabile?

   - a) ==
   - b) =
   - c) :=
   - d) =>

6. Quale di questi è un ciclo in C?

   - a) repeat
   - b) for
   - c) until
   - d) loop

7. Quale funzione si usa per leggere input da tastiera?

   - a) input()
   - b) scanf()
   - c) gets()
   - d) read()

8. Quale valore restituisce la funzione `main()` per indicare successo?

   - a) 1
   - b) 0
   - c) -1
   - d) true

9. Quale di questi è un tipo di dato per caratteri?

   - a) int
   - b) char
   - c) float
   - d) bool

10. Quale operatore incrementa una variabile di 1?

    - a) ++
    - b) --
    - c) +=
    - d) ==

11. Quale funzione serve per allocare memoria dinamica?

    - a) malloc()
    - b) alloc()
    - c) new()
    - d) memalloc()

12. Quale parola chiave serve per dichiarare una struttura?

    - a) struct
    - b) object
    - c) class
    - d) record

13. Quale di questi è un operatore logico?

    - a) &&
    - b) ++
    - c) \*\*
    - d) //

14. Quale funzione libera memoria allocata dinamicamente?

    - a) free()
    - b) delete()
    - c) remove()
    - d) clear()

15. Quale simbolo si usa per accedere ai membri di una struttura?

    - a) .
    - b) ->
    - c) ::
    - d) :

16. Quale di questi è un tipo di ciclo che esegue almeno una volta?

    - a) for
    - b) while
    - c) do...while
    - d) repeat

17. Quale direttiva include una libreria standard?

    - a) #include
    - b) #import
    - c) #define
    - d) #library

18. Quale funzione converte una stringa in intero?

    - a) atoi()
    - b) itoa()
    - c) toint()
    - d) strint()

19. Quale di questi è un operatore di confronto?

    - a) ==
    - b) =
    - c) ++
    - d) &&

20. Quale parola chiave serve per uscire da un ciclo?

    - a) exit
    - b) break
    - c) continue
    - d) stop

21. Quale di questi è un tipo di puntatore?

    - a) int*
    - b) int&
    - c) int@
    - d) int#

22. Quale funzione serve per stampare una singola lettera?

    - a) putchar()
    - b) printf()
    - c) print()
    - d) echo()

23. Quale di questi è un operatore di modulo?

    - a) %
    - b) /
    - c) \*
    - d) ^

24. Quale simbolo si usa per terminare una istruzione in C?

    - a) ,
    - b) .
    - c) ;
    - d) :

25. Quale funzione serve per stampare un messaggio a schermo?

    - a) printf()
    - b) scanf()
    - c) main()
    - d) exit()

26. Quale di questi è un array di caratteri?

    - a) char nome[10];
    - b) int nome[10];
    - c) float nome[10];
    - d) string nome[10];

27. Quale operatore serve per accedere all’indirizzo di una variabile?

    - a) &
    - b) \*
    - c) @
    - d) #

28. Quale di questi è un file header standard?

    - a) stdio.h
    - b) io.h
    - c) main.h
    - d) string.h

29. Quale funzione serve per confrontare due stringhe?

    - a) strcmp()
    - b) strcomp()
    - c) compare()
    - d) strcompare()

30. Quale parola chiave serve per dichiarare una funzione?
    - a) void
    - b) function
    - c) def
    - d) fun

## Domande a Risposta Aperta

1. Spiega la differenza tra variabili locali e globali in C.
2. Descrivi il funzionamento della funzione `scanf()` e i suoi possibili rischi.
3. Cosa sono i puntatori e a cosa servono in C?
4. Come si gestisce la memoria dinamica in C? Fai un esempio.
5. Quali sono i vantaggi dell’uso delle strutture (`struct`)?

---

## Esercizi

1. Scrivi un programma C che legge 3 numeri interi da tastiera e stampa la somma totale.
2. Scrivi una funzione C che effettua la somma di due numeri interi passati come argomenti e restituisce il risultato.

---

## Soluzioni

| N°  | Risposta corretta |
| --- | ----------------- |
| 1   | b) int            |
| 2   | a) //             |
| 3   | b) printf()       |
| 4   | c) const          |
| 5   | b) =              |
| 6   | b) for            |
| 7   | b) scanf()        |
| 8   | b) 0              |
| 9   | b) char           |
| 10  | a) ++             |
| 11  | a) malloc()       |
| 12  | a) struct         |
| 13  | a) &&             |
| 14  | a) free()         |
| 15  | a) .              |
| 16  | c) do...while     |
| 17  | a) #include       |
| 18  | a) atoi()         |
| 19  | a) ==             |
| 20  | b) break          |
| 21  | a) int *          |
| 22  | a) putchar()      |
| 23  | a) %              |
| 24  | c) ;              |
| 25  | a) printf()       |
| 26  | a) char nome[10]; |
| 27  | a) &              |
| 28  | a) stdio.h        |
| 29  | a) strcmp()       |
| 30  | a) void           |

### Soluzioni Risposta Multipla

---

### Risposte Aperte

1. **Differenza tra variabili locali e globali:**  
   Le variabili locali sono dichiarate all’interno di una funzione e sono accessibili solo in quella funzione. Le variabili globali sono dichiarate fuori da tutte le funzioni e sono accessibili da qualsiasi parte del programma.

2. **Funzionamento di `scanf()` e rischi:**  
   `scanf()` legge input da tastiera e lo assegna a variabili. I rischi includono buffer overflow se non si limita la lunghezza dell’input e errori di formattazione che possono causare comportamenti imprevisti.

3. **Cosa sono i puntatori e a cosa servono:**  
   I puntatori sono variabili che memorizzano l’indirizzo di memoria di un’altra variabile. Servono per gestire array, stringhe, strutture, memoria dinamica e per passare grandi strutture alle funzioni senza copiarle.

4. **Gestione memoria dinamica in C (esempio):**  
   Si usa `malloc()` per allocare memoria e `free()` per liberarla.

   ```c
   int *p = malloc(sizeof(int) * 10);
   // ... utilizzo di p ...
   free(p);
   ```

5. **Vantaggi delle strutture (`struct`):**  
   Permettono di raggruppare dati correlati sotto un unico tipo, facilitando la gestione e l’organizzazione di dati complessi.

---

### Soluzioni Esercizi

1. **Programma che legge 3 numeri e stampa la somma:**

   ```c
   #include <stdio.h>
   int main() {
        int a, b, c, somma;
        printf("Inserisci tre numeri interi: ");
        scanf("%d %d %d", &a, &b, &c);
        somma = a + b + c;
        printf("La somma totale è: %d\n", somma);
        return 0;
   }
   ```

2. **Funzione somma di due numeri interi:**
   ```c
   int somma(int a, int b) {
        return a + b;
   }
   ```
---


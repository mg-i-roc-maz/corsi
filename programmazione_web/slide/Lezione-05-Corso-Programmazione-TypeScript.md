---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
style: |
  section {
    font-size: 2.3em;
  }
---

# Lezione: Introduzione a TypeScript

---

## Cos'è TypeScript?

- Superset di JavaScript sviluppato da Microsoft
- Aggiunge tipizzazione statica e altre funzionalità
- Compilato in JavaScript standard

---

## Perché usare TypeScript?

- Maggiore sicurezza grazie alla tipizzazione
- Migliore supporto agli editor (autocomplete, refactoring)
- Facilita la manutenzione di progetti grandi

---

## Installazione

```bash
npm install -g typescript
```

Compilare un file `.ts`:

```bash
tsc nomefile.ts
```

---

## Primo esempio

```typescript
let messaggio: string = "Ciao, TypeScript!";
console.log(messaggio);
```

---

## Come compilare e provare TypeScript

1. **Scrivi il codice in un file `.ts`**  
   Ad esempio, crea un file chiamato `esempio.ts`.

2. **Compila il file TypeScript in JavaScript**  
   Da terminale, esegui:

   ```bash
   tsc esempio.ts
   ```

   Verrà generato un file `esempio.js`.

3. **Esegui il file JavaScript con Node.js**

   ```bash
   node esempio.js
   ```

4. **Prova online**  
   Puoi anche testare il codice direttamente nel [Playground TypeScript](https://www.typescriptlang.org/play).

---

## Tipi di base

- `string`
- `number`
- `boolean`
- `any`
- `void`
- `null` e `undefined`

---

### Esempi

```typescript
let nome: string = "Mario";
let eta: number = 30;
let isStudente: boolean = true;
let valoreQualsiasi: any = 42;
```

---

## Array e Tuple

```typescript
let numeri: number[] = [1, 2, 3];
let tuple: [string, number] = ["età", 25];
```

---

## Enum

```typescript
enum Colore {
  Rosso,
  Verde,
  Blu,
}
let c: Colore = Colore.Verde;
```

---

## Funzioni

```typescript
function somma(a: number, b: number): number {
  return a + b;
}
```

---

## Parametri opzionali e di default

```typescript
function saluta(nome: string = "ospite"): void {
  console.log("Ciao, " + nome);
}
```

---

## Oggetti e Interfacce

```typescript
interface Persona {
  nome: string;
  eta: number;
}

let persona: Persona = { nome: "Anna", eta: 28 };
```

---

## Classi

```typescript
class Animale {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
  parla(): void {
    console.log(this.nome + " fa un verso.");
  }
}

let cane = new Animale("Fido");
cane.parla();
```

---

## Ereditarietà

```typescript
class Cane extends Animale {
  parla(): void {
    console.log(this.nome + " abbaia.");
  }
}

let dog = new Cane("Rex");
dog.parla();
```

---

## Tipi Unione e Type Alias

```typescript
type ID = number | string;
let userId: ID = 123;
userId = "abc";
```

---

## Generics

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("ciao");
```

---

## Moduli

**esempio:**

```typescript
// file: saluti.ts
export function saluta(nome: string) {
  return `Ciao, ${nome}`;
}

// file: main.ts
import { saluta } from "./saluti";
console.log(saluta("Luca"));
```

---

## Ambienti di sviluppo consigliati

- Visual Studio Code
- Plugin TypeScript

---

## Esercizio 1

Definisci un'interfaccia `Libro` con titolo, autore e anno. Crea una funzione che accetta un array di libri e stampa i titoli.

---

## Esercizio 2

Crea una classe `Studente` con proprietà nome e matricola, e un metodo che stampa una presentazione.

---

## Esercizio 3

Scrivi una funzione generica che accetta un array di qualsiasi tipo e restituisce il primo elemento.

---

## Risorse utili

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Playground TypeScript](https://www.typescriptlang.org/play)

---

## Domande?

---
marp: true
theme: default
class: lead
---

# Java OOP: Classi e Oggetti

---

## Cos'è una Classe?

- Modello per creare oggetti
- Definisce attributi (campi) e comportamenti (metodi)

```java
class Persona {
    String nome;
    void saluta() {
        System.out.println("Ciao!");
    }
}
```

---

## Cos'è un Oggetto?

- Istanza di una classe
- Ha stato e comportamento

```java
Persona p = new Persona();
p.nome = "Mario";
p.saluta();
```

---

## Incapsulamento

- Nasconde i dettagli interni
- Si usano modificatori: `private`, `public`, `protected`
- Si accede ai dati tramite metodi (getter/setter)

```java
class Conto {
    private double saldo;
    public double getSaldo() { return saldo; }
    public void deposita(double x) { saldo += x; }
}
```

---

## Ereditarietà

- Una classe può estendere un'altra
- Permette riuso e specializzazione

```java
class Animale {
    void verso() { System.out.println("???"); }
}
class Cane extends Animale {
    void verso() { System.out.println("Bau"); }
}
```

---

## Polimorfismo

- Un oggetto può essere trattato come il suo tipo base
- Permette flessibilità

```java
Animale a = new Cane();
a.verso(); // Stampa "Bau"
```

---

## Astrazione

- Si definiscono solo le funzionalità essenziali
- Si usano classi astratte e metodi astratti

```java
abstract class Forma {
    abstract double area();
}
class Cerchio extends Forma {
    double area() { return Math.PI * r * r; }
    double r;
}
```

---

## Interfacce

- Contratto di metodi da implementare
- Una classe può implementare più interfacce

```java
interface Volante {
    void vola();
}
class Uccello implements Volante {
    public void vola() { System.out.println("Sto volando!"); }
}
```

---

## Costruttori

- Metodo speciale per inizializzare oggetti
- Ha lo stesso nome della classe

```java
class Persona {
    String nome;
    Persona(String n) { nome = n; }
}
```

---

## Override

- Sovrascrive un metodo della superclasse
- Si usa l'annotazione `@Override`

```java
class Animale {
    void verso() { System.out.println("???"); }
}
class Gatto extends Animale {
    @Override
    void verso() { System.out.println("Miao"); }
}
```

---

## Riepilogo

- Classi e oggetti sono la base
- Incapsulamento protegge i dati
- Ereditarietà e polimorfismo danno flessibilità
- Astrazione e interfacce favoriscono la progettazione
- Costruttori e override sono strumenti chiave

---

## Esercitazione



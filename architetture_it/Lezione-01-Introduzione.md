---
marp: true
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
style: |
  html, body, section, .marp-slide, .marp-slide * {
    font-size: 2.1em !important;
  }
  `
---

<!-- slide: title -->

# Modulo 1: Introduzione alle Architetture IT

### Durata: 4 ore

---

## Obiettivi del Corso

- Comprendere le basi delle architetture IT
- Analizzare i principali modelli architetturali
- Collegare le competenze acquisite agli scenari reali

---

## Agenda

1. Presentazione del corso e degli obiettivi
2. Panoramica sui modelli architetturali
3. Macrocompetenze di riferimento
4. Discussione e domande

---

## Cos'è un'Architettura IT?

- Struttura organizzativa dei sistemi informatici
- Definisce componenti, relazioni e flussi informativi
- Fondamentale per la scalabilità e la sicurezza

---

## Esempi e Schemi

### Esempio di Architettura Monolitica

```
+----------------------+
|  Applicazione unica  |
+----------------------+
|   Database condiviso |
+----------------------+
```

Tutte le funzionalità sono racchiuse in un unico blocco.

### Esempio di Architettura Client-Server

```
+--------+      Richiesta      +--------+
| Client | <-----------------> | Server |
+--------+     Risposta        +--------+
```

Il client invia richieste al server che elabora e risponde.

---

### Esempio di Architettura a Microservizi

```
+-----------+   +-----------+   +-----------+
| Servizio 1|   | Servizio 2|   | Servizio 3|
+-----------+   +-----------+   +-----------+
    \             |             /
     \            |            /
      +-----------------------+
      |     API Gateway       |
      +-----------------------+
          |
      +-------------+
      |   Client    |
      +-------------+
```

Ogni servizio è indipendente e comunica tramite API.

---

### Esempio di Architettura Event-Driven

```
+---------+      +-------------+      +---------+
| Producer| ---> | Message Bus | ---> | Consumer|
+---------+      +-------------+      +---------+
```

I componenti comunicano tramite eventi su un bus di messaggi.

---

### Esempio di Architettura Cloud-Native

```
+-------------------+
|   Container 1     |
+-------------------+
+-------------------+
|   Container 2     |
+-------------------+
     |
+-----------------------+
|   Orchestratore (es.  |
|     Kubernetes)       |
+-----------------------+
     |
+-------------------+
|   Cloud Provider  |
+-------------------+
```

Le applicazioni sono suddivise in container gestiti da un orchestratore nel cloud.

---

### Scalabilità nelle Architetture IT

- La scalabilità permette a un sistema di gestire un aumento del carico di lavoro senza perdere efficienza.
- Può essere verticale (potenziamento di una singola macchina) o orizzontale (aggiunta di più macchine).

### Sicurezza nelle Architetture IT

- La progettazione architetturale deve includere misure di sicurezza come autenticazione, autorizzazione e cifratura dei dati.
- L’adozione di modelli Zero Trust è sempre più diffusa.

### Evoluzione delle Architetture

- Le architetture IT si sono evolute per rispondere a esigenze di agilità, resilienza e time-to-market.

---

# L’adozione di container e orchestratori (es. Kubernetes) ha rivoluzionato la gestione delle applicazioni.

---

## Importanza delle Architetture IT

- Supporto ai processi aziendali
- Ottimizzazione delle risorse
- Adattabilità ai cambiamenti tecnologici

---

## Modelli Architetturali: Panoramica

- Monolitico
- Client-Server
- Microservizi
- Event-Driven
- Cloud-Native

---

## Architettura Monolitica

- Tutte le funzionalità in un unico blocco
- Semplice da sviluppare, difficile da scalare

### Esempio di Architettura Monolitica

```
+-------------------------------+
|        Applicazione           |
|-------------------------------|
|   Modulo Autenticazione       |
|   Modulo Gestione Utenti      |
|   Modulo Ordini               |
|   Modulo Pagamenti            |
+-------------------------------+
|         Database              |
+-------------------------------+
```

Tutti i moduli sono integrati in un'unica applicazione che accede a un database condiviso.

---

### Vantaggi dell'Architettura Monolitica

- **Semplicità di sviluppo**: facile da configurare e avviare, ideale per progetti piccoli o MVP.
- **Deployment unico**: una sola unità da distribuire e gestire.
- **Performance**: comunicazione interna tra moduli molto veloce.
- **Debugging centralizzato**: più semplice tracciare errori in un unico codice base.

---

### Svantaggi dell'Architettura Monolitica

- **Scalabilità limitata**: difficile scalare solo parti specifiche dell'applicazione.
- **Manutenzione complessa**: modifiche a un modulo possono impattare l'intero sistema.
- **Dipendenze strette**: aggiornare una libreria o componente può richiedere il retest completo.
- **Rischio di "Big Ball of Mud"**: il codice tende a diventare difficile da gestire e comprendere nel tempo.
- **Deployment rischioso**: ogni rilascio coinvolge l'intera applicazione, aumentando il rischio di introdurre bug.

---

### Considerazioni su Sviluppo e Manutenzione

- **Team piccoli**: adatta a team ridotti che lavorano su tutto lo stack.
- **Ciclo di vita**: adatta per progetti con requisiti stabili e crescita limitata.
- **Evoluzione**: la crescita delle funzionalità può rendere necessario il passaggio a modelli più modulari (es. microservizi).

---

## Architettura Client-Server

- Separazione tra client (frontend) e server (backend)
- Comunicazione tramite protocolli standard

### Esempi di Architettura Client-Server

#### Esempio 1: Applicazione Web Tradizionale

```
+----------+      HTTP      +-----------+      SQL      +----------+
|  Browser | <-----------> | Web Server| <-----------> | Database |
+----------+                +-----------+               +----------+
```

Il browser (client) invia richieste al web server, che elabora i dati e interagisce con il database.

---

#### Esempio 2: Applicazione Desktop con Server Centrale

```
+-----------+      TCP/IP      +-----------+
| Desktop   | <------------->  | Server    |
+-----------+                  +-----------+
```

Il client desktop comunica con il server centrale per accedere a dati e servizi condivisi.

---

### Fattori di Successo

- **Separazione delle responsabilità**: facilita la manutenzione e l'evoluzione delle componenti.
- **Scalabilità**: è possibile scalare il server per gestire più client.
- **Standardizzazione**: utilizzo di protocolli comuni (HTTP, TCP/IP).
- **Sicurezza**: centralizzazione dei controlli di accesso e dei dati.

---

### Limiti dell'Architettura Client-Server

- **Single Point of Failure**: il server rappresenta un punto critico, se non ridondato.
- **Scalabilità limitata**: la crescita del numero di client può saturare le risorse del server.
- **Manutenzione del server**: aggiornamenti e downtime impattano tutti i client.
- **Dipendenza dalla rete**: la comunicazione client-server richiede una connessione stabile.

---

## Architettura a Microservizi

- Applicazione suddivisa in servizi indipendenti
- Facilita la scalabilità e la manutenzione

---

## Architettura Event-Driven

- Basata su eventi e messaggi
- Ideale per sistemi reattivi e scalabili

---

## Architettura Cloud-Native

- Progettata per il cloud
- Scalabilità automatica, resilienza e deployment rapido

---

## Macrocompetenze di Riferimento

- Analisi dei requisiti architetturali
- Progettazione di soluzioni IT
- Valutazione delle tecnologie emergenti

---

## Esempi Pratici

- Caso di studio: Migrazione da monolite a microservizi
- Analisi di un'architettura cloud-native

---

## Discussione

- Quali modelli architetturali conoscete?
- Esperienze personali con architetture IT

---

## Domande e Risposte

- Spazio per chiarimenti e approfondimenti

---

## Conclusioni

- Riepilogo dei concetti chiave
- Prossimi passi nel corso

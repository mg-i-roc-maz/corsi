# Microservizi, Caching ed Event-Driven

Corso di 24 ore (8 lezioni da 3 ore) per ragazzi post-diploma con basi di programmazione.
Progetto fil rouge: un mini e-commerce con tre servizi (`catalog`, `orders`, `notifications`) che cresce lezione dopo lezione.

Stack: Node.js + TypeScript (Fastify), Docker Compose, PostgreSQL, Redis, RabbitMQ, Nginx.

## Contenuto

| Cartella | Cosa contiene |
|---|---|
| `slides-corso/` | Presentazione del corso (sorgenti delle slide) |
| `pre-corso/slides/` | Modulo pre-corso facoltativo (2 ore): terminale, HTTP, JSON, Git |
| `lezione-1/slides/` | Slide della lezione 1: teoria, laboratorio passo passo, esercizi extra |
| `lezione-1/start/` | Codice di partenza del laboratorio |
| `lezione-1/solution/` | Soluzione del laboratorio |
| `lezione-1/extra/` | Test e soluzioni degli esercizi extra |

## Per gli studenti

```bash
git clone https://github.com/mg-i-roc-maz/corsi
cd corsi/microservizi/lezione-1/start
code .
```

Poi segui `SETUP.md` e `README.md` dentro la cartella della lezione.

## Programma

1. Dal monolite ai microservizi
2. Docker e Docker Compose
3. Progettare e far comunicare i servizi
4. Resilienza e configurazione
5. Caching: fondamenti
6. Caching nei microservizi
7. Architetture event-driven
8. Pattern avanzati e progetto finale

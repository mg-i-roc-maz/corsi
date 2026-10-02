# Microservizi, Caching ed Event-Driven

Corso di 24 ore (8 lezioni da 3 ore) per ragazzi post-diploma con basi di programmazione.
Progetto fil rouge: un mini e-commerce con tre servizi (`catalog`, `orders`, `notifications`) che cresce lezione dopo lezione.

Stack: Node.js + TypeScript (Fastify), Docker Compose, PostgreSQL, Redis, RabbitMQ, Nginx.

## Contenuto

| Cartella | Cosa contiene |
|---|---|
| `presentazione-corso.pdf` | Presentazione del corso |
| `pre-corso/slides.pdf` | Modulo pre-corso facoltativo (2 ore): terminale, HTTP, JSON, Git |
| `lezione-1/slides.pdf` | Slide della lezione 1: teoria, laboratorio passo passo, esercizi extra |
| `lezione-1/start/` | Codice di partenza del laboratorio |
| `lezione-1/solution/` | Soluzione del laboratorio |
| `lezione-1/extra/` | Test e soluzioni degli esercizi extra |
| `lezione-2/slides.pdf` | Slide della lezione 2: Docker e Docker Compose |
| `lezione-2/start/` | Codice di partenza: catalog con PostgreSQL, servizio orders, Dockerfile e Compose da completare |
| `lezione-2/solution/` | Soluzione del laboratorio |
| `lezione-2/extra/` | Esercizi extra e soluzioni |

## Per gli studenti

```bash
git clone https://github.com/mg-i-roc-maz/corsi
cd corsi/microservizi/lezione-1/start
code .
```

Per le lezioni successive basta `git pull` dalla cartella `corsi` e poi aprire `lezione-N/start`.

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

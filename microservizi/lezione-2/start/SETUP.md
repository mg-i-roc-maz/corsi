# Setup per la lezione 2

Da fare **prima** della lezione. Tempo stimato: 10 minuti.

## 1. Aggiorna il repo

```bash
cd corsi
git pull
cd microservizi/lezione-2/start
code .
```

## 2. Controlla Docker

Docker Desktop deve essere **avviato** (icona della balena nella barra in alto su Mac, nella tray su Windows). Poi, dal terminale del computer:

| Comando | Deve rispondere |
|---|---|
| `docker version` | sia `Client` sia `Server` |
| `docker compose version` | `Docker Compose version v2...` o successiva |
| `docker run hello-world` | `Hello from Docker!` |

## 3. Scarica le immagini in anticipo

Le immagini pesano qualche centinaio di MB: meglio scaricarle a casa che con il Wi-Fi dell'aula.

```bash
docker pull node:22-slim
docker pull postgres:16
docker pull nginx
```

## 4. Dove lanciare i comandi

- **Comandi `docker`**: nel terminale del computer (Terminale su Mac, PowerShell su Windows), dalla cartella `lezione-2/start`.
- **Codice e `npm test`**: dove preferisci, anche nel Dev Container come nella lezione 1.

## Problemi frequenti

| Problema | Soluzione |
|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop non è avviato: aprilo e aspetta che sia "running" |
| `port is already allocated` sulla 5432 | Hai già PostgreSQL sul computer: fermalo, oppure in `compose.yaml` usa `"5433:5432"` |
| `port is already allocated` sulla 3001 | Il catalog della lezione 1 è ancora acceso: fermalo con `Ctrl+C` |
| La build è lentissima | La prima volta scarica tutto; le successive usano la cache |
| Il disco si riempie | `docker system prune` rimuove container fermi e immagini inutilizzate |
| Mac con chip Apple e immagini `amd64` | Le immagini ufficiali usate qui sono multi-architettura: non serve fare nulla |

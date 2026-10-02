# Setup dell'ambiente

Da fare **prima** della lezione 1. Tempo stimato: 20-30 minuti.

## 1. Installa gli strumenti

| Strumento | Dove scaricarlo | Verifica |
|---|---|---|
| Git | https://git-scm.com | `git --version` |
| Docker Desktop | https://www.docker.com/products/docker-desktop | `docker run hello-world` |
| VS Code | https://code.visualstudio.com | — |

Docker serve dalla lezione 2, ma installalo subito: è il passaggio che dà più problemi.
Su Windows, Docker Desktop richiede WSL 2: segui le istruzioni dell'installer.

## 2. Clona il repo

```bash
git clone <URL-DEL-REPO> microservizi-corso
cd microservizi-corso
git checkout lesson-1-start
code .
```

## 3. Scegli come lavorare

### Opzione A, consigliata: Dev Container

Non serve installare Node.js sul tuo computer: gira tutto dentro un container.

1. In VS Code installa l'estensione **Dev Containers**.
2. Quando VS Code propone *"Reopen in Container"*, accetta. In alternativa: `F1` → `Dev Containers: Reopen in Container`.
3. La prima volta servono alcuni minuti: il container installa Node.js 22 e le dipendenze.

### Opzione B: Node.js in locale

1. Installa Node.js 22 LTS da https://nodejs.org (o con `nvm install 22`).
2. Verifica con `node -v` (deve iniziare con `v22`).
3. Installa le dipendenze:

```bash
cd monolith && npm install
cd ../services/catalog && npm install
```

4. In VS Code installa le estensioni consigliate: compare un avviso in basso a destra, oppure cerca **REST Client** e **Docker** nel pannello Estensioni.

## 4. Verifica finale

```bash
cd services/catalog
npm run dev
```

Apri `http/catalog.http` e clicca **Send Request** sopra `GET {{catalog}}/health`. Se vedi `"status": "ok"`, sei pronto.

## Problemi frequenti

| Problema | Soluzione |
|---|---|
| `EADDRINUSE: address already in use` | La porta è occupata: chiudi l'altro processo o usa `PORT=3002 npm run dev` |
| `npm install` molto lento o in errore | Controlla la connessione o il proxy; con il Dev Container riprova `Rebuild Container` |
| Docker non parte su Windows | Abilita la virtualizzazione nel BIOS e installa WSL 2 |
| "Send Request" non compare | Il file deve avere estensione `.http` e l'estensione REST Client deve essere attiva |

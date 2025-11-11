# API Java per la gestione dei Post

Questa applicazione espone una REST API per la gestione dei post, utilizzando Spring Boot e MySQL. Il progetto è completamente dockerizzato e include dati di esempio.

## Funzionalità

- **GET /api/posts**: Restituisce tutti i post presenti nel database
- **POST /api/posts**: Crea un nuovo post

## Struttura database

Tabella `post`:

- id (BIGINT, PK, AUTO_INCREMENT)
- titolo (VARCHAR)
- contenuto (TEXT)
- data_creazione (DATETIME)

## Avvio rapido

1. Costruisci il jar dell'applicazione:
   ```sh
   mvn clean package
   ```
2. Avvia tutto con Docker Compose:
   ```sh
   docker compose -f docker/docker-compose.yml up --build
   ```
3. L'API sarà accessibile su `http://localhost:8080/api/posts`

## Esempio dati

Il database viene inizializzato con alcuni post di esempio tramite lo script `init.sql`.

## Note

- La porta dell'API è `8080`.
- La porta di MySQL è `3306`.

## Esempi di utilizzo con `curl`

### Lettura di tutti i post

```sh
curl -X GET http://localhost:8080/api/posts
```

### Creazione di un nuovo post

```sh
curl -X POST http://localhost:8080/api/posts \
   -H "Content-Type: application/json" \
   -d '{"titolo": "Titolo esempio", "contenuto": "Contenuto del post"}'
```
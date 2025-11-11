
CREATE TABLE IF NOT EXISTS post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titolo VARCHAR(255) NOT NULL,
    contenuto TEXT NOT NULL,
    data_creazione DATETIME NOT NULL,
    post_like INT DEFAULT 0
);

INSERT INTO post (titolo, contenuto, data_creazione, post_like) VALUES
    ('Primo post', 'Questo e il primo post di esempio. In questo articolo introdurremo le funzionalita principali della nostra piattaforma e come iniziare a utilizzarla per pubblicare contenuti.', NOW(), 0),
    ('Secondo post', 'Questo e il secondo post di esempio. Approfondiremo alcune delle opzioni disponibili per la personalizzazione dei tuoi articoli e come gestire i commenti degli utenti.', NOW(), 0),
    ('Post di test', 'Un altro post di esempio per testare l API. Questo articolo serve a verificare che tutte le operazioni CRUD funzionino correttamente e che i dati vengano visualizzati correttamente nell interfaccia utente.', NOW(), 0),
    ('Post di benvenuto', 'Benvenuto nel nostro blog! Questo e un post di benvenuto dove troverai informazioni utili su come navigare tra le varie sezioni, trovare risorse e contattare il supporto.', NOW(), 0),
    ('Aggiornamento', 'Abbiamo appena aggiornato la nostra piattaforma. In questo post troverai una panoramica delle nuove funzionalita, miglioramenti delle prestazioni e correzioni di bug implementate nell ultima versione.', NOW(), 0),
    ('Guida rapida', 'Ecco una guida rapida per iniziare a usare l API. Segui questi semplici passaggi per configurare il tuo ambiente, effettuare richieste e integrare i dati nel tuo progetto.', NOW(), 0),
    ('Annuncio importante', 'Leggi questo annuncio per informazioni importanti riguardanti la manutenzione programmata del servizio, le modifiche ai termini di utilizzo e le novita in arrivo.', NOW(), 0),
    ('Post di esempio', 'Questo e solo un altro post di esempio. Utilizzalo per testare la visualizzazione dei dati, la paginazione degli articoli e le funzionalita di ricerca all interno del blog.', NOW(), 0)
;
-- Eseguito da PostgreSQL solo al PRIMO avvio, quando il volume dei dati è vuoto.
-- Se modifichi questo file, ricrea il volume: docker compose down -v

CREATE SEQUENCE product_seq;

CREATE TABLE products (
  id          text PRIMARY KEY DEFAULT 'p-' || nextval('product_seq'),
  name        text    NOT NULL,
  description text    NOT NULL DEFAULT '',
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  stock       integer NOT NULL CHECK (stock >= 0)
);

INSERT INTO products (name, description, price_cents, stock) VALUES
  ('Tastiera meccanica', 'Switch rossi, layout italiano', 8990, 12),
  ('Mouse wireless',     'Sensore 16000 DPI',             3990, 30),
  ('Monitor 27"',        'QHD, 144 Hz',                   27900, 5);

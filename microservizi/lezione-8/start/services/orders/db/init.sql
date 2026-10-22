-- Il database di orders. Eseguito da PostgreSQL solo al PRIMO avvio, a volume vuoto.
-- Se modifichi questo file, ricrea il volume: docker compose down -v

CREATE SEQUENCE order_seq;

CREATE TABLE orders (
  id             text PRIMARY KEY DEFAULT 'o-' || nextval('order_seq'),
  customer_email text        NOT NULL,
  -- Le righe "fotografano" nome e prezzo: in JSON, insieme all'ordine.
  lines          jsonb       NOT NULL,
  total_cents    integer     NOT NULL CHECK (total_cents >= 0),
  status         text        NOT NULL DEFAULT 'confirmed',
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- L'OUTBOX: gli eventi da pubblicare, scritti nella stessa transazione dell'ordine.
CREATE TABLE outbox (
  id           bigserial PRIMARY KEY,         -- l'ordine di pubblicazione
  event_id     uuid        NOT NULL UNIQUE,   -- l'id dell'evento: lo stesso che vedrà notifications
  routing_key  text        NOT NULL,
  event        jsonb       NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz                    -- vuoto = ancora da pubblicare
);

-- Il relay cerca sempre gli eventi non pubblicati: un indice solo su quelli.
CREATE INDEX outbox_pending ON outbox (id) WHERE published_at IS NULL;

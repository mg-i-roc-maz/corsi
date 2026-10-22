// Archivio degli ordini su PostgreSQL: il database di orders, solo suo (orders-db).
// Le tabelle le crea db/init.sql al primo avvio del container.
//
// La parte importante è create(): ordine ed eventi nella STESSA TRANSAZIONE.
//   BEGIN
//     INSERT INTO orders ...
//     INSERT INTO outbox ...
//   COMMIT        <- tutto insieme. Se qualcosa fallisce prima: ROLLBACK, niente di niente.
import pg from "pg";
import type { EventsFor, Order, OrderLine, OrderStore, OutboxEntry } from "./store.js";
import { totalOf } from "./store.js";

const orderColumns = `id, customer_email AS "customerEmail", lines, total_cents AS "totalCents", status,
                      to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt"`;

export function createPostgresOrderStore(connectionString: string): OrderStore {
  const pool = new pg.Pool({ connectionString, connectionTimeoutMillis: 2000 });

  return {
    async list() {
      const { rows } = await pool.query<Order>(`SELECT ${orderColumns} FROM orders ORDER BY created_at`);
      return rows;
    },

    async get(id) {
      const { rows } = await pool.query<Order>(`SELECT ${orderColumns} FROM orders WHERE id = $1`, [id]);
      return rows[0];
    },

    async create(customerEmail: string, lines: OrderLine[], eventsFor?: EventsFor) {
      // Una transazione vive su UNA connessione: la prendiamo dal pool e la teniamo fino alla fine.
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const { rows } = await client.query<Order>(
          `INSERT INTO orders (customer_email, lines, total_cents) VALUES ($1, $2, $3) RETURNING ${orderColumns}`,
          [customerEmail, JSON.stringify(lines), totalOf(lines)],
        );
        const order = rows[0];
        for (const { routingKey, event } of eventsFor?.(order) ?? []) {
          await client.query("INSERT INTO outbox (event_id, routing_key, event) VALUES ($1, $2, $3)", [
            event.id,
            routingKey,
            JSON.stringify(event),
          ]);
        }
        await client.query("COMMIT");
        return order;
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },

    async cancel(id: string, eventsFor?: EventsFor) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        // WHERE status = 'confirmed': annullare due volte non fa niente la seconda volta.
        const { rows } = await client.query<Order>(
          `UPDATE orders SET status = 'cancelled' WHERE id = $1 AND status = 'confirmed' RETURNING ${orderColumns}`,
          [id],
        );
        const order = rows[0];
        if (order) {
          for (const { routingKey, event } of eventsFor?.(order) ?? []) {
            await client.query("INSERT INTO outbox (event_id, routing_key, event) VALUES ($1, $2, $3)", [event.id, routingKey, JSON.stringify(event)]);
          }
        }
        await client.query("COMMIT");
        return order;
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },

    // Extra 3: due copie di orders, due relay. Senza un lucchetto, tutti e due leggono
    // gli stessi eventi e li pubblicano due volte. FOR UPDATE SKIP LOCKED: ogni relay
    // blocca le righe che prende, e salta quelle già bloccate dall'altro.
    async relayLocked(limit: number, publish: (entry: OutboxEntry) => Promise<void>) {
      const client = await pool.connect();
      let published = 0;
      try {
        await client.query("BEGIN");
        const { rows } = await client.query<OutboxEntry>(
          `SELECT id::int AS id, routing_key AS "routingKey", event, created_at AS "createdAt"
           FROM outbox WHERE published_at IS NULL ORDER BY id LIMIT $1 FOR UPDATE SKIP LOCKED`,
          [limit],
        );
        const done: number[] = [];
        try {
          for (const entry of rows) {
            await publish(entry);
            done.push(entry.id);
          }
        } finally {
          if (done.length) await client.query("UPDATE outbox SET published_at = now() WHERE id = ANY($1::bigint[])", [done]);
          await client.query("COMMIT");
          published = done.length;
        }
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        if (published === 0) throw err;
      } finally {
        client.release();
      }
      return published;
    },

    async pendingEvents(limit) {
      const { rows } = await pool.query<OutboxEntry>(
        `SELECT id::int AS id, routing_key AS "routingKey", event, created_at AS "createdAt"
         FROM outbox WHERE published_at IS NULL ORDER BY id LIMIT $1`,
        [limit],
      );
      return rows;
    },

    async markPublished(ids) {
      if (ids.length) await pool.query("UPDATE outbox SET published_at = now() WHERE id = ANY($1::bigint[])", [ids]);
    },

    async outboxStats() {
      const { rows } = await pool.query<{ pending: number; published: number }>(
        `SELECT count(*) FILTER (WHERE published_at IS NULL)::int AS pending,
                count(*) FILTER (WHERE published_at IS NOT NULL)::int AS published FROM outbox`,
      );
      return rows[0];
    },

    async ping() {
      await pool.query("SELECT 1");
    },

    async close() {
      await pool.end();
    },
  };
}

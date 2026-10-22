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

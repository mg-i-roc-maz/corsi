// Archivio su PostgreSQL. La tabella e i prodotti iniziali li crea
// db/init.sql, che il container di Postgres esegue al primo avvio.
import pg from "pg";
import type { Product, ProductStore } from "./types.js";

// Nel database le colonne sono in snake_case, in TypeScript in camelCase:
// la SELECT rinomina le colonne con AS, così le righe sono già dei Product.
// ORDER BY length(id), id: così p-2 viene prima di p-10 (in ordine alfabetico sarebbe dopo).
const columns = `id, name, description, price_cents AS "priceCents", stock`;

export function createPostgresStore(connectionString: string): ProductStore {
  // Un Pool tiene aperte alcune connessioni e le riusa tra le richieste.
  const pool = new pg.Pool({ connectionString });

  return {
    async list(query) {
      // I valori passano sempre come parametri ($1): mai concatenati nella stringa SQL.
      const { rows } = query
        ? await pool.query<Product>(`SELECT ${columns} FROM products WHERE name ILIKE $1 ORDER BY length(id), id`, [`%${query}%`])
        : await pool.query<Product>(`SELECT ${columns} FROM products ORDER BY length(id), id`);
      return rows;
    },
    async get(id) {
      const { rows } = await pool.query<Product>(`SELECT ${columns} FROM products WHERE id = $1`, [id]);
      return rows[0];
    },
    async create(input) {
      const { rows } = await pool.query<Product>(
        `INSERT INTO products (name, description, price_cents, stock)
         VALUES ($1, $2, $3, $4) RETURNING ${columns}`,
        [input.name, input.description, input.priceCents, input.stock],
      );
      return rows[0];
    },
    async replace(id, input) {
      const { rows } = await pool.query<Product>(
        `UPDATE products SET name = $2, description = $3, price_cents = $4, stock = $5
         WHERE id = $1 RETURNING ${columns}`,
        [id, input.name, input.description, input.priceCents, input.stock],
      );
      return rows[0];
    },
    async remove(id) {
      const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
      return result.rowCount === 1;
    },
    async reserve(id, quantity) {
      // UNA sola istruzione: PostgreSQL controlla e sottrae in modo atomico.
      // Se le scorte non bastano, la WHERE non trova righe e niente cambia.
      const { rows } = await pool.query<Product>(
        `UPDATE products SET stock = stock - $2
         WHERE id = $1 AND stock >= $2 RETURNING ${columns}`,
        [id, quantity],
      );
      if (rows[0]) return { status: "reserved", product: rows[0] };
      // Nessuna riga aggiornata: il prodotto non esiste o le scorte non bastano?
      const current = await pool.query<{ stock: number }>("SELECT stock FROM products WHERE id = $1", [id]);
      return current.rows[0]
        ? { status: "insufficient_stock", available: current.rows[0].stock }
        : { status: "not_found" };
    },
    async close() {
      await pool.end();
    },
  };
}

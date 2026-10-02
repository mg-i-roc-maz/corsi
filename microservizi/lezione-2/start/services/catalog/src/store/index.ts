// Sceglie l'archivio in base alle variabili d'ambiente:
// con DATABASE_URL usa PostgreSQL, senza usa la memoria.
import { createMemoryStore } from "./memory.js";
import { createPostgresStore } from "./postgres.js";
import type { ProductStore } from "./types.js";

export function createStoreFromEnv(env: NodeJS.ProcessEnv = process.env): ProductStore {
  return env.DATABASE_URL ? createPostgresStore(env.DATABASE_URL) : createMemoryStore();
}

export { createMemoryStore, createPostgresStore };
export type { Product, ProductInput, ProductStore } from "./types.js";

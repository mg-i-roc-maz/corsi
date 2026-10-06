import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("config: valori di default senza variabili d'ambiente", () => {
  const config = loadConfig({});
  assert.equal(config.port, 3002);
  assert.equal(config.catalog.timeoutMs, 2000);
});

test("config: legge le variabili d'ambiente", () => {
  const config = loadConfig({ CATALOG_URL: "http://catalog:3001", CATALOG_TIMEOUT_MS: "500", CATALOG_RETRIES: "0" });
  assert.equal(config.catalog.url, "http://catalog:3001");
  assert.equal(config.catalog.timeoutMs, 500);
  assert.equal(config.catalog.retries, 0);
});

test("config: un valore sbagliato ferma l'avvio con un messaggio chiaro", () => {
  assert.throws(() => loadConfig({ CATALOG_TIMEOUT_MS: "due secondi" }), /CATALOG_TIMEOUT_MS/);
  assert.throws(() => loadConfig({ CATALOG_URL: "catalog:3001" }), /CATALOG_URL/);
});

// Test degli esercizi extra della lezione 3 lato orders (1 e 2).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { fakeCatalog } from "./fake-catalog.js";

test("Extra 1: se la seconda riga non ha scorte, la prima viene rilasciata", async () => {
  const catalog = fakeCatalog();
  const app = buildApp({ catalog });
  const res = await app.inject({
    method: "POST",
    url: "/orders",
    payload: { customerEmail: "anna@example.com", items: [{ productId: "p-1", quantity: 2 }, { productId: "p-3", quantity: 5 }] },
  });
  assert.equal(res.statusCode, 409);
  assert.equal(catalog.products.get("p-1")?.stock, 12); // tornata com'era
});

test("Extra 2: una sola chiamata a catalog per leggere i prodotti", async () => {
  const catalog = fakeCatalog();
  let calls = 0;
  const original = catalog.getProducts.bind(catalog);
  catalog.getProducts = async (ids) => {
    calls++;
    return original(ids);
  };
  catalog.getProduct = async () => {
    throw new Error("getProduct non dovrebbe più essere usato");
  };
  const app = buildApp({ catalog });
  const res = await app.inject({
    method: "POST",
    url: "/orders",
    payload: { customerEmail: "anna@example.com", items: [{ productId: "p-1", quantity: 1 }, { productId: "p-2", quantity: 1 }] },
  });
  assert.equal(res.statusCode, 201);
  assert.equal(calls, 1);
});

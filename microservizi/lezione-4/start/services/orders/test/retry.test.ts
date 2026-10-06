import { test } from "node:test";
import assert from "node:assert/strict";
import { backoffDelay, withRetry } from "../src/retry.js";

test("backoff: il massimo raddoppia a ogni tentativo, fino al tetto", () => {
  const always = () => 1; // "random" sempre al massimo
  assert.deepEqual([1, 2, 3, 4, 5].map((n) => backoffDelay(n, 100, 1000, always)), [100, 200, 400, 800, 1000]);
});

test("backoff: con il jitter l'attesa è tra 0 e il massimo", () => {
  assert.equal(backoffDelay(3, 100, 1000, () => 0), 0);
  assert.equal(backoffDelay(3, 100, 1000, () => 0.5), 200);
});

test("withRetry: non riprova gli errori che shouldRetry scarta", async () => {
  let calls = 0;
  await assert.rejects(
    withRetry(
      async () => {
        calls++;
        throw new Error("non riprovare");
      },
      { retries: 5, baseMs: 1, shouldRetry: () => false },
    ),
  );
  assert.equal(calls, 1);
});

test("withRetry: riprova finché l'operazione riesce, avvisando a ogni giro", async () => {
  let calls = 0;
  const attempts: number[] = [];
  const result = await withRetry(
    async () => {
      calls++;
      if (calls < 3) throw new Error("non ancora");
      return "fatto";
    },
    { retries: 5, baseMs: 1, onRetry: (_err, attempt) => attempts.push(attempt) },
  );
  assert.equal(result, "fatto");
  assert.equal(calls, 3);
  assert.deepEqual(attempts, [1, 2]);
});

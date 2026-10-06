// Riprovare un'operazione che fallisce, aspettando sempre un po' di più.
//
//   tentativo 1 ── errore ── attesa ~100 ms
//   tentativo 2 ── errore ── attesa ~200 ms
//   tentativo 3 ── errore ── si arrende
//
// L'attesa è casuale tra 0 e il massimo ("jitter"): se cento client falliscono
// insieme, non riprovano tutti nello stesso istante.

export interface RetryOptions {
  retries: number; // tentativi in più dopo il primo
  baseMs: number; // attesa massima dopo il primo errore; raddoppia a ogni giro
  maxMs?: number; // tetto all'attesa
  shouldRetry?: (err: unknown) => boolean; // quali errori vale la pena riprovare
  onRetry?: (err: unknown, attempt: number, delayMs: number) => void;
  random?: () => number; // per i test
}

export function backoffDelay(attempt: number, baseMs: number, maxMs: number, random: () => number): number {
  const max = Math.min(maxMs, baseMs * 2 ** (attempt - 1));
  return Math.round(random() * max);
}

export async function withRetry<T>(operation: () => Promise<T>, options: RetryOptions): Promise<T> {
  const { retries, baseMs, maxMs = 2000, shouldRetry = () => true, onRetry, random = Math.random } = options;
  // Parte 3 · TODO 2: un ciclo che
  //   1. prova operation(); se riesce, restituisce il risultato
  //   2. se fallisce e i tentativi in più sono finiti (attempt > retries),
  //      oppure shouldRetry(err) è false, rilancia l'errore
  //   3. altrimenti calcola l'attesa con backoffDelay(attempt, baseMs, maxMs, random),
  //      chiama onRetry?.(err, attempt, delay), aspetta e riprova
  // Per aspettare: await new Promise((resolve) => setTimeout(resolve, delay));
  void retries;
  void shouldRetry;
  void onRetry;
  void maxMs;
  void random;
  return operation();
}

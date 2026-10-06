// Tutta la configurazione di orders, letta UNA volta all'avvio dalle variabili d'ambiente.
// Se un valore è sbagliato il servizio non parte: meglio un errore chiaro subito
// che un comportamento strano alle tre di notte.

export interface Config {
  port: number;
  host: string;
  logLevel: string;
  catalog: {
    url: string;
    timeoutMs: number; // quanto aspettare una risposta di catalog
    retries: number; // quanti tentativi IN PIÙ per le letture
    retryBaseMs: number; // attesa di base tra un tentativo e l'altro
    maxConcurrent: number; // Extra 2: chiamate contemporanee massime
    fallbackMaxAgeMs: number; // Extra 4: età massima del prodotto di riserva (0 = niente fallback)
  };
  breaker: {
    errorThresholdPercentage: number; // oltre questa % di errori il circuito si apre
    volumeThreshold: number; // quante chiamate servono prima di giudicare
    resetTimeoutMs: number; // dopo quanto riprovare con una chiamata di prova
    windowMs: number; // su quale finestra di tempo si contano chiamate ed errori
  };
}

function int(env: NodeJS.ProcessEnv, name: string, fallback: number, min = 0): number {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min) {
    throw new Error(`Configurazione non valida: ${name}=${raw} (atteso un intero >= ${min})`);
  }
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const url = env.CATALOG_URL ?? "http://localhost:3001";
  if (!/^https?:\/\//.test(url)) {
    throw new Error(`Configurazione non valida: CATALOG_URL=${url} (deve iniziare con http:// o https://)`);
  }
  return {
    port: int(env, "PORT", 3002, 1),
    host: env.HOST ?? "0.0.0.0",
    logLevel: env.LOG_LEVEL ?? "info",
    catalog: {
      url,
      timeoutMs: int(env, "CATALOG_TIMEOUT_MS", 2000, 1),
      retries: int(env, "CATALOG_RETRIES", 2),
      retryBaseMs: int(env, "CATALOG_RETRY_BASE_MS", 100),
      maxConcurrent: int(env, "CATALOG_MAX_CONCURRENT", 20, 1),
      fallbackMaxAgeMs: int(env, "CATALOG_FALLBACK_MAX_AGE_MS", 0),
    },
    breaker: {
      errorThresholdPercentage: int(env, "BREAKER_ERROR_PERCENT", 50, 1),
      volumeThreshold: int(env, "BREAKER_MIN_CALLS", 5, 1),
      resetTimeoutMs: int(env, "BREAKER_RESET_MS", 10000, 1),
      // Deve contenere almeno BREAKER_MIN_CALLS chiamate LENTE: con timeout di 2 s
      // e una finestra di 10 s non si arriverebbe mai a 5 chiamate, e il circuito
      // non si aprirebbe mai proprio quando catalog è bloccato.
      windowMs: int(env, "BREAKER_WINDOW_MS", 30000, 1000),
    },
  };
}

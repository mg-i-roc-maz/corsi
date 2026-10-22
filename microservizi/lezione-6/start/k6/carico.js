// Test di carico con k6: tanti utenti virtuali (VU) chiedono lo stesso prodotto.
//
//   docker compose run --rm k6 run /scripts/carico.js
//   docker compose run --rm k6 run -e BASE=http://catalog:3001 -e VUS=50 /scripts/carico.js
//
// Variabili (-e NOME=valore):
//   BASE      dove mandare le richieste    default http://gateway/api/v1 (attraverso il gateway)
//             http://catalog:3001 = direttamente a catalog, senza la cache del gateway
//   ID        quale prodotto               default p-1
//   VUS       quanti utenti contemporanei  default 20
//   DURATION  per quanto tempo             default 20s
import http from "k6/http";
import { check } from "k6";

const BASE = __ENV.BASE || "http://gateway/api/v1";
const ID = __ENV.ID || "p-1";

export const options = {
  vus: Number(__ENV.VUS || 20),
  duration: __ENV.DURATION || "20s",
  // Nel riepilogo: media, mediana, 95° e 99° percentile dei tempi.
  summaryTrendStats: ["avg", "med", "p(95)", "p(99)", "max"],
};

export default function () {
  // Ogni VU ripete questa funzione senza pause, finché il test non finisce.
  const res = http.get(`${BASE}/products/${ID}`);
  check(res, { "status 200": (r) => r.status === 200 });
}

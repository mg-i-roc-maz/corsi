#!/usr/bin/env bash
# Lo stampede, misurato: quante letture arrivano al database durante un test di carico?
#   ./scripts/stampede.sh            50 utenti per 30 secondi, direttamente su catalog
# Prima, per renderlo visibile:
#   CACHE_TTL_SECONDS=5 DB_DELAY_MS=300 docker compose up -d catalog
# Su Windows: da Git Bash o WSL.
vus="${1:-50}"
duration="${2:-30s}"
db_reads() { curl -s http://localhost:8080/stats/cache | sed -E 's/.*"dbReads":([0-9]+).*/\1/'; }

before=$(db_reads)
docker compose run --rm k6 run --quiet -e BASE=http://catalog:3001 -e VUS="$vus" -e DURATION="$duration" /scripts/carico.js
after=$(db_reads)
echo
echo "letture dal database durante il test: $((after - before))"
curl -s http://localhost:8080/stats/cache
echo

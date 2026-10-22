#!/usr/bin/env bash
# Crea N ordini di fila attraverso il gateway (default 3) e stampa il risultato di ognuno.
#   ./scripts/ordini.sh        3 ordini
#   ./scripts/ordini.sh 10     10 ordini
# Su Windows: da Git Bash o WSL.
n="${1:-3}"
for i in $(seq 1 "$n"); do
  curl -s -o /dev/null -w "ordine $i: %{http_code} in %{time_total} s\n" \
    -X POST http://localhost:8080/api/v1/orders \
    -H 'Content-Type: application/json' \
    -d "{\"customerEmail\":\"cliente$i@example.com\",\"items\":[{\"productId\":\"p-2\",\"quantity\":1}]}"
done
echo
curl -s http://localhost:8080/stats/notifications
echo

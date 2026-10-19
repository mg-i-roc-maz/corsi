#!/usr/bin/env bash
# Misura i tempi di risposta di un prodotto, attraverso il gateway.
#   ./scripts/misura.sh            10 letture di p-1
#   ./scripts/misura.sh p-2 20     20 letture di p-2
# Su Windows: da Git Bash o WSL.
id="${1:-p-1}"
n="${2:-10}"
url="http://localhost:8080/api/v1/products/$id"
echo "GET $url"
for i in $(seq 1 "$n"); do
  out=$(curl -s -o /dev/null -D - -w "TEMPO %{time_total}" "$url")
  cache=$(printf '%s\n' "$out" | grep -i '^x-cache:' | awk '{print $2}' | tr -d '\r')
  tempo=$(printf '%s\n' "$out" | grep '^TEMPO' | awk '{printf "%.0f", $2 * 1000}')
  printf '%3d  %-7s %5s ms\n' "$i" "${cache:--}" "$tempo"
done
echo
curl -s http://localhost:8080/stats/cache
echo

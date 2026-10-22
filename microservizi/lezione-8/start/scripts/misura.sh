#!/usr/bin/env bash
# Misura i tempi di risposta di un prodotto, attraverso il gateway.
#   ./scripts/misura.sh            10 letture di p-1
#   ./scripts/misura.sh p-2 20     20 letture di p-2
# Due colonne di cache: quella del gateway (X-Gateway-Cache) e quella di catalog (X-Cache).
# Con un HIT del gateway catalog non viene chiamato: la sua colonna mostra
# l'header salvato nella copia, cioè com'era andata la PRIMA volta.
# Su Windows: da Git Bash o WSL.
id="${1:-p-1}"
n="${2:-10}"
url="http://localhost:8080/api/v1/products/$id"
echo "GET $url"
printf '%3s  %-9s %-7s %5s\n' "#" "gateway" "catalog" "ms"
for i in $(seq 1 "$n"); do
  out=$(curl -s -o /dev/null -D - -w "TEMPO %{time_total}" "$url")
  gw=$(printf '%s\n' "$out" | grep -i '^x-gateway-cache:' | awk '{print $2}' | tr -d '\r')
  cache=$(printf '%s\n' "$out" | grep -i '^x-cache:' | awk '{print $2}' | tr -d '\r')
  tempo=$(printf '%s\n' "$out" | grep '^TEMPO' | awk '{printf "%.0f", $2 * 1000}')
  printf '%3d  %-9s %-7s %5s\n' "$i" "${gw:--}" "${cache:--}" "$tempo"
done
echo
curl -s http://localhost:8080/stats/cache
echo

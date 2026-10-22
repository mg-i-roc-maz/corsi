#!/usr/bin/env bash
# Il giro completo del negozio: gateway, cache, ordine, outbox, evento, email.
# Ogni riga dice OK o NO. È il checkpoint finale del corso.
#   ./scripts/giro-completo.sh
# Su Windows: da Git Bash o WSL.
g=http://localhost:8080
ok=0; no=0
check() { if [ "$2" = "0" ]; then echo "OK  $1"; ok=$((ok + 1)); else echo "NO  $1"; no=$((no + 1)); fi; }

for s in catalog orders notifications; do
  curl -sf "$g/health/$s" > /dev/null; check "$s è pronto" $?
done

curl -s -o /dev/null "$g/api/v1/products/p-1"
cache=$(curl -s -D - -o /dev/null "$g/api/v1/products/p-1" | grep -i '^x-gateway-cache' | tr -d '\r' | awk '{print $2}')
[ "$cache" = "HIT" ]; check "seconda lettura di p-1: HIT nel gateway ($cache)" $?

email="giro$(date +%s)@example.com"
code=$(curl -s -o /tmp/giro-ordine.json -w '%{http_code}' -X POST "$g/api/v1/orders" \
  -H 'Content-Type: application/json' -d "{\"customerEmail\":\"$email\",\"items\":[{\"productId\":\"p-2\",\"quantity\":1}]}")
[ "$code" = "201" ]; check "ordine creato (HTTP $code)" $?

sleep 2
curl -s "$g/stats/outbox" | grep -q '"pending":0'; check "outbox vuoto: l'evento è partito" $?
curl -s "$g/api/v1/notifications" | grep -q "$email"; check "email di conferma inviata a $email" $?

echo
echo "$ok OK, $no NO"
[ "$no" = "0" ]

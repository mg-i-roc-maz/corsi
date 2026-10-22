#!/usr/bin/env bash
# Pubblica DUE VOLTE lo stesso OrderCreated (stesso id), come farebbe una riconsegna.
# Con un consumer idempotente: UNA sola email, e un doppione riconosciuto.
#   ./scripts/evento-doppio.sh
# Usa l'API HTTP della Management UI di RabbitMQ (porta 15672, guest/guest).
# Su Windows: da Git Bash o WSL.
id="doppio-$(date +%s)"
event="{\"id\":\"$id\",\"type\":\"OrderCreated\",\"version\":1,\"occurredAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"data\":{\"orderId\":\"o-prova\",\"customerEmail\":\"doppio@example.com\",\"totalCents\":3990,\"lines\":[{\"productId\":\"p-2\",\"productName\":\"Mouse wireless\",\"quantity\":1,\"unitPriceCents\":3990}]}}"
payload=$(printf '%s' "$event" | sed 's/"/\\"/g')
body="{\"properties\":{\"message_id\":\"$id\",\"content_type\":\"application/json\",\"delivery_mode\":2},\"routing_key\":\"order.created\",\"payload\":\"$payload\",\"payload_encoding\":\"string\"}"
for i in 1 2; do
  curl -s -u guest:guest -H 'Content-Type: application/json' -X POST \
    http://localhost:15672/api/exchanges/%2F/shop.events/publish -d "$body"
  echo "  <- pubblicazione $i dell'evento $id"
done
sleep 2
echo
curl -s http://localhost:8080/stats/notifications
echo

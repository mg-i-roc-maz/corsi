#!/usr/bin/env bash
# Pubblica un messaggio ILLEGGIBILE (non è JSON) su order.created.
# notifications non lo potrà mai gestire: deve finire subito nella DLQ.
#   ./scripts/evento-rotto.sh
# Su Windows: da Git Bash o WSL.
curl -s -u guest:guest -H 'Content-Type: application/json' -X POST \
  http://localhost:15672/api/exchanges/%2F/shop.events/publish \
  -d '{"properties":{"content_type":"text/plain","delivery_mode":2},"routing_key":"order.created","payload":"questo non è JSON","payload_encoding":"string"}'
echo
sleep 6   # le statistiche della Management UI si aggiornano ogni 5 secondi
echo "messaggi nella DLQ:"
curl -s -u guest:guest http://localhost:15672/api/queues/%2F/notifications.order-created.dlq | sed -E 's/.*"messages":([0-9]+).*/\1/'
echo

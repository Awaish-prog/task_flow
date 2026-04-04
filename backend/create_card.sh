#!/bin/bash

URL="http://127.0.0.1:8000/api/v1/cards/"

for i in $(seq 208 308)
do
  NAME="test$i"

  RESPONSE=$(curl -s -X POST "$URL" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$NAME\",
      \"description\": \"des\",
      \"card_list_id\": 1
    }")

  echo "Response for $NAME:"
  echo "$RESPONSE"
  echo "-----------------------------"
done
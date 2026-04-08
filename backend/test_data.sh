#!/bin/bash

BOARD_CARD_URL="http://127.0.0.1:8000/api/v1/boards/"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfdXNlciJ9.nJAHaGRLxh6yTeVIBslenYASzVvU-351nx8Kc-QMuN8"

for name in test1 test2
do
  curl -X POST "$BOARD_CARD_URL" \
    -H "accept: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"board_name\": \"$name\"}"

  echo -e "\n---\n"
done

CARD_LIST_CARD_URL="http://127.0.0.1:8000/api/v1/card_lists/"

# Board 1 lists
for name in list1 list2 list3
do
  curl -X POST "$CARD_LIST_CARD_URL" \
    -H "accept: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"card_list_name\": \"$name\", \"board_id\": 1}"

  echo -e "\n---\n"
done

# Board 2 lists
for name in list11 list22 list33
do
  curl -X POST "$CARD_LIST_CARD_URL" \
    -H "accept: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"card_list_name\": \"$name\", \"board_id\": 2}"

  echo -e "\n---\n"
done


CARD_URL="http://127.0.0.1:8000/api/v1/cards/"

declare -A data=(
  [1]="test1 test2 test3"
  [2]="test4 test5 test6"
  [3]="test7 test8 test9"
  [4]="test11 test22 test33"
  [5]="test44 test55 test66"
  [6]="test77 test88 test99"
)

for list_id in "${!data[@]}"
do
  for name in ${data[$list_id]}
  do
    curl -X POST "$CARD_URL" \
      -H "accept: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"card_name\": \"$name\", \"description\": \"des\", \"card_list_id\": $list_id}"

    echo -e "\n--- card created: $name (list $list_id) ---\n"
  done
done
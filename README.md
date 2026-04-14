# Task Flow – Full Stack Assessment

## Run project

```bash
git clone https://github.com/Awaish-prog/task_flow.git
cd task_flow
docker compose up
```

## Key Design Decisions

### 1. Ordering Algorithm (String-Based)

To support efficient reordering of cards, a **string-based ordering algorithm** is used.

#### Why not integers?
Integer-based ordering requires shifting multiple records when reordering, which is inefficient and does not scale. For example, inserting a card at position 1 in a list of 1000 cards would require updating all 1000 records.

#### Why not floats?
Floats seem like a natural fit — inserting between two cards at positions `1.0` and `2.0` just means assigning `1.5`, then `1.25`, `1.375`, and so on. No bulk updates needed. However, this approach has a fundamental precision ceiling: IEEE 754 double-precision floats have a fixed number of significant bits, so after enough insertions in the same gap the midpoint calculation collapses — two adjacent cards end up with identical float values, making stable ordering impossible without a full reindex.

#### Why strings?
String keys sidestep the precision problem entirely. The lexicographic space between any two strings is effectively unbounded — a new key can always be generated between them without ever exhausting the available space. This makes every reorder operation a true `O(1)` write with no risk of key exhaustion over time.

#### Solution
Each card has an `order_key` (string). When moving a card:
- A new key is generated between the `prev_card`'s key and the `next_card`'s key
- No bulk updates are required — only the moved card is written

#### Jitter
A small random jitter is applied during key generation to reduce the probability of two concurrent moves producing identical keys, adding a natural buffer against collisions.

#### Implementation
```python
card.order_key = generate_jittered_key_between(prev_key, next_key)
```

---

### 2. Race Condition Handling (Concurrent Card Moves)

#### The Problem
Two users moving cards simultaneously can cause a race condition:

1. User A and User B both read the same `order_key` values for adjacent cards
2. Both compute a new key for the same position
3. Both write — one silently overwrites the other, or both produce identical keys, breaking sort order

#### Solution: Database-Level Pessimistic Locking + Atomic Transactions

Each move operation runs inside a **single atomic database transaction**, and the card being moved is fetched with a **`SELECT FOR UPDATE` lock**. This ensures:

- Only one transaction can hold the lock on a given card at a time
- Concurrent requests for the same card are **serialized**, not silently merged
- The transaction either fully succeeds or fully rolls back — no partial writes

```python
@router.patch("/move/{card_id}", response_model=Card)
async def update_card_order(card_id: int, card: CardOrderUpdate, db: DBDep, card_service: CardOrderServiceDep) -> Card:
    async with db.begin():
        return await card_service.update(db, card_id, card)
```

```python
async def update(
        self,
        db: AsyncSession,
        id: int,
        obj_in: CardOrderUpdate
    ):
        card: Card = await self.repository.get_with_lock(db, id)  # SELECT FOR UPDATE
        prev_card: Card = await self.repository.get(db, obj_in.prev_card_id)
        next_card: Card = await self.repository.get(db, obj_in.next_card_id)
            
        is_prev_in_same_list = prev_card and prev_card.order_key and prev_card.card_list_id == obj_in.card_list_id
        is_next_in_same_list = next_card and next_card.order_key and next_card.card_list_id == obj_in.card_list_id
            
        prev_key = prev_card.order_key if is_prev_in_same_list else None
        next_key = next_card.order_key if is_next_in_same_list else None
        
        are_keys_in_order = prev_key and next_key and prev_key < next_key
            
        card.order_key = generate_jittered_key_between(prev_key, next_key) if are_keys_in_order else generate_jittered_key_between(next_key, prev_key)
        card.card_list_id = obj_in.card_list_id
        await db.flush()
        return card
```

#### Why this works
- `get_with_lock` issues a `SELECT FOR UPDATE`, acquiring a row-level lock on the card
- Any competing transaction attempting to lock the same card will **block** until the first one commits
- By the time the second transaction proceeds, it works with a fresh, consistent database state
- The jittered key generation further reduces the chance of key collisions when two users move **different** cards to adjacent positions simultaneously

## 🔐 Authentication

> **Dev Phase Note:** Authentication is hardcoded for the frontend development phase. A static JWT token is embedded directly in the frontend config (`src/config.ts`) and sent with every API request as a Bearer token.

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfdXNlciJ9.nJAHaGRLxh6yTeVIBslenYASzVvU-351nx8Kc-QMuN8"
}
```

The token decodes to `{ "username": "test_user" }` and is signed with HS256. No login page or auth flow exists at this stage — this is intentional and acceptable per the assessment scope.

---
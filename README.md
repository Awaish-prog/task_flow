# Task Flow – Full Stack Assessment

Task Flow is a Kanban-style project management tool built as part of a full-stack system design assessment. The focus of this project is on backend correctness, performance, and architecture, along with a responsive and smooth frontend experience.

## Key Design Decisions

### 1. Ordering Algorithm (String-Based)

To support efficient reordering of cards, a **string-based ordering algorithm** is used.

#### Why not integers?
Integer-based ordering requires shifting multiple records when reordering, which is inefficient and does not scale. For example, inserting a card at position 1 in a list of 1000 cards would require updating all 1000 records.

#### Why strings?
String keys can always have a new value generated **between** any two existing keys lexicographically, without touching any other record. This makes every reorder operation an `O(1)` update — only the moved card is written.

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
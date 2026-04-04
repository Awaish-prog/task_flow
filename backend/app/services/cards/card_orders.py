from app.services.cards.cards import CardService
from app.schemas.cards import CardCreateRequest, CardOrderUpdate, CardCreate, Card
from sqlalchemy.ext.asyncio import AsyncSession
from fractional_indexing_jittered import generate_key_between, generate_jittered_key_between

class CardOrderService(CardService):
    def __init__(self):
        super().__init__()
        
    async def create(self, db: AsyncSession, obj_in: CardCreateRequest):
        last_card = await self.repository.get_cards_in_list_desc(db, obj_in.card_list_id)

        last_key = last_card.order_key if last_card else None
        key = generate_key_between(last_key, None)
 
        new_card = CardCreate(
            name= obj_in.name,
            description= obj_in.description,
            order_key= key,
            card_list_id= obj_in.card_list_id
        )

        return await self.repository.create(db, new_card.model_dump())

    async def update(
        self,
        db: AsyncSession,
        id: int,
        obj_in: CardOrderUpdate
    ):
        async with db.begin():
            
            card: Card = await self.repository.get_with_lock(db, id)
            prev_card: Card = await self.repository.get(db, obj_in.prev_card_id)
            next_card: Card = await self.repository.get(db, obj_in.next_card_id)
            
            is_prev_in_same_list = prev_card and prev_card.order_key and prev_card.card_list_id == obj_in.card_list_id
            is_next_in_same_list = next_card and next_card.order_key and next_card.card_list_id == obj_in.card_list_id
            
            prev_key = prev_card.order_key if is_prev_in_same_list else None
            next_key = next_card.order_key if is_next_in_same_list else None
            
            card.order_key = generate_jittered_key_between(prev_key, next_key)
            card.card_list_id = obj_in.card_list_id
            await db.flush()
            return card

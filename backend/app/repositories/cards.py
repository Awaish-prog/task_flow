from app.models.cards import Card
from app.repositories.base import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, text

class CardRepository(BaseRepository[Card]):
    def __init__(self):
        super().__init__(Card)
        
    async def get_cards_in_list_desc(self, db: AsyncSession, list_id: int, limit: int = 1):
        result = await db.execute(
                select(Card)
                .where(Card.card_list_id == list_id)
                .order_by(text('order_key COLLATE "C" DESC'))
                .limit(limit))
        return result.scalar_one_or_none()
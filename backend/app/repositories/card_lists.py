from app.models.card_lists import CardList
from app.repositories.base import BaseRepository

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

class CardListRepository(BaseRepository[CardList]):
    def __init__(self):
        super().__init__(CardList)
        
    async def get(self, db: AsyncSession, id: int) -> Optional[CardList]:
        result = await db.execute(select(self.model).where(self.model.id == id).options(selectinload(CardList.cards)))
        return result.scalar_one_or_none()
    
    async def delete(self, db: AsyncSession, card_list: CardList) -> None:

        for card in card_list.cards:
            card.soft_delete()

        card_list.soft_delete()

        await db.commit()
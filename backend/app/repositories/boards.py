from typing import Optional
from app.models.boards import Board
from app.models.card_lists import CardList
from app.repositories.base import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

class BoardRepository(BaseRepository[Board]):
    def __init__(self):
        super().__init__(Board)
        
    async def get(self, db: AsyncSession, id: int) -> Optional[Board]:
        result = await db.execute(select(self.model).where(self.model.id == id).options(selectinload(Board.card_lists).selectinload(CardList.cards)))
        return result.scalar_one_or_none()
    
    async def delete(self, db: AsyncSession, id: int) -> bool:
        board = await self.get(db, id)

        if not board:
            return False

        for card_list in board.card_lists:
            for card in card_list.cards:
                card.soft_delete()
            card_list.soft_delete()

        board.soft_delete()

        await db.commit()
        return True
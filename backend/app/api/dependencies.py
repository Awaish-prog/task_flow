from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from typing import Annotated

from app.db.database import get_db
from app.services.boards.boards import BoardService
from app.services.cards.cards import CardService
from app.services.cards.card_orders import CardOrderService
from app.services.card_lists.card_lists import CardListService
from app.services.boards.provider import get_board_service
from app.services.cards.provider import get_cards_service, get_card_orders_service
from app.services.card_lists.provider import get_card_lists_service


BoardServiceDep = Annotated[BoardService, Depends(get_board_service)]
CardServiceDep = Annotated[CardService, Depends(get_cards_service)]
CardOrderServiceDep = Annotated[CardOrderService, Depends(get_card_orders_service)]
CardListServiceDep = Annotated[CardListService, Depends(get_card_lists_service)]
DBDep = Annotated[AsyncSession, Depends(get_db)]
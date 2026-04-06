from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.db.database import get_db
from app.services.boards.boards import BoardService
from app.services.cards.cards import CardService
from app.services.cards.card_orders import CardOrderService
from app.services.card_lists.card_lists import CardListService
from app.services.boards.provider import get_board_service
from app.services.cards.provider import get_cards_service, get_card_orders_service
from app.services.card_lists.provider import get_card_lists_service
from app.api.v1.auth.jwt_auth import verify_token


BoardServiceDep = Annotated[BoardService, Depends(get_board_service)]
CardServiceDep = Annotated[CardService, Depends(get_cards_service)]
CardOrderServiceDep = Annotated[CardOrderService, Depends(get_card_orders_service)]
CardListServiceDep = Annotated[CardListService, Depends(get_card_lists_service)]
DBDep = Annotated[AsyncSession, Depends(get_db)]


security = HTTPBearer()

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
        )

    return payload
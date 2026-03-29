from fastapi import APIRouter
from app.api.v1.routes import card_lists, cards, boards

api_router = APIRouter()

api_router.include_router(cards.router, prefix="/cards", tags=["cards"])
api_router.include_router(boards.router, prefix="/boards", tags=["boards"])
api_router.include_router(card_lists.router, prefix="/card_lists", tags=["card_lists"])
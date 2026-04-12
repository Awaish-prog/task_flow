from fastapi import APIRouter
from typing import List
from app.schemas.cards import CardUpdate, CardOrderUpdate, Card, CardCreateRequest
from app.api.dependencies import DBDep, CardServiceDep, CardOrderServiceDep

router = APIRouter()

@router.get("/", response_model=List[Card])
async def read_cards(db: DBDep, card_service: CardServiceDep) -> List[Card]:
    return await card_service.get_all(db)

@router.get("/{card_id}", response_model=Card)
async def read_card(card_id: int, db: DBDep, card_service: CardServiceDep) -> Card:
    return await card_service.get(db, card_id)

@router.post("/", response_model=Card)
async def create_card(card: CardCreateRequest, db: DBDep, card_service: CardOrderServiceDep) -> Card:
    return await card_service.create(db, card)

@router.put("/{card_id}", response_model=Card)
async def update_card(card_id: int, card: CardUpdate, db: DBDep, card_service: CardServiceDep) -> Card:
    return await card_service.update(db, card_id, card)

@router.patch("/move/{card_id}", response_model=Card)
async def update_card_order(card_id: int, card: CardOrderUpdate, db: DBDep, card_service: CardOrderServiceDep) -> Card:
    return await card_service.update(db, card_id, card)

@router.delete("/{card_id}", response_model=None)
async def delete_card(card_id: int, db: DBDep, card_service: CardServiceDep) -> None:
    return await card_service.delete(db, card_id)
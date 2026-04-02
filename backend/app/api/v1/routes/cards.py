from fastapi import APIRouter
from typing import List
from app.schemas.cards import Card, CardCreate, CardUpdate
from app.api.dependencies import DBDep, CardServiceDep

router = APIRouter()

@router.get("/", response_model=List[Card])
async def read_cards(db: DBDep, card_service: CardServiceDep) -> List[Card]:
    return await card_service.get_all(db)

@router.get("/{card_id}", response_model=Card)
async def read_card(card_id: int, db: DBDep, card_service: CardServiceDep) -> Card:
    return await card_service.get(db, card_id)

@router.post("/", response_model=Card)
async def create_card(card: CardCreate, db: DBDep, card_service: CardServiceDep) -> Card:
    return await card_service.create(db, card)

@router.put("/{card_id}", response_model=Card)
async def update_card(card_id: int, card: CardUpdate, db: DBDep, card_service: CardServiceDep) -> Card:
    return await card_service.update(db, card_id, card)

@router.delete("/{card_id}", response_model=bool)
async def delete_card(card_id: int, db: DBDep, card_service: CardServiceDep) -> bool:
    return await card_service.delete(db, card_id)
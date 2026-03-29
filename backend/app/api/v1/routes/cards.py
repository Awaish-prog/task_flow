from fastapi import APIRouter
from typing import List
from app.schemas.cards import Card, CardCreate, CardUpdate

router = APIRouter()

@router.get("/", response_model=List[Card])
def read_cards() -> List[Card]:
    return []

@router.get("/{card_id}", response_model=Card)
def read_card() -> Card:
    return None

@router.post("/", response_model=Card)
def create_card(card: CardCreate) -> Card:
    return None

@router.put("/{card_id}", response_model=Card)
def update_card(card: CardUpdate) -> Card:
    return None

from fastapi import APIRouter

router = APIRouter()

from fastapi import APIRouter
from typing import List
from app.schemas.card_lists import CardList, CardListCreate, CardListUpdate

router = APIRouter()

@router.get("/", response_model=List[CardList])
def read_card_lists() -> List[CardList]:
    return []

@router.get("/{card_list_id}", response_model=CardList)
def read_card_list() -> CardList:
    return None

@router.post("/", response_model=CardList)
def create_card_list(card_list: CardListCreate) -> CardList:
    return None

@router.put("/{card_list_id}", response_model=CardList)
def update_card_list(card_list: CardListUpdate) -> CardList:
    return None

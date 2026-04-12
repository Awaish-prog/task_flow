from fastapi import APIRouter
from typing import List
from app.schemas.card_lists import CardList, CardListUpdate, CardListResponse, CardListCreate
from app.api.dependencies import DBDep, CardListServiceDep

router = APIRouter()

@router.get("/", response_model=List[CardListResponse])
async def read_card_lists(db: DBDep, card_list_service: CardListServiceDep) -> List[CardListResponse]:
    return await card_list_service.get_all(db)

@router.get("/{card_list_id}", response_model=CardList)
async def read_card_list(card_list_id: int, db: DBDep, card_list_service: CardListServiceDep) -> CardList:
    return await card_list_service.get(db, card_list_id) 

@router.post("/", response_model=CardListResponse)
async def create_card_list(card_list: CardListCreate, db: DBDep, card_list_service: CardListServiceDep) -> CardListResponse:
    return await card_list_service.create(db, card_list)

@router.put("/{card_list_id}", response_model=CardList)
async def update_card_list(card_list_id: int, card_list: CardListUpdate, db: DBDep, card_list_service: CardListServiceDep) -> CardList:
    return await card_list_service.update(db, card_list_id, card_list) 

@router.delete("/{card_list_id}", response_model=None)
async def delete_card_list(card_list_id: int, db: DBDep, card_list_service: CardListServiceDep) -> None:
    return await card_list_service.delete(db, card_list_id)
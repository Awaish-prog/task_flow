from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from app.schemas.cards import Card

class CardListBase(BaseModel):
    id: int
    
class CardListApi(BaseModel):
    name: str
    board_id: int
    
class CardListResponse(CardListBase):
    name: str
    board_id: int

class CardListUpdate(BaseModel):
    name: Optional[str] = None
    board_id: Optional[int] = None

class CardList(CardListBase):
    name: str
    board_id: int
    cards: List[Card] = []
    
    model_config = ConfigDict(from_attributes=True)
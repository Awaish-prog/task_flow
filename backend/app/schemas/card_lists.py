from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from app.schemas.cards import Card

class CardListBase(BaseModel):
    id: int
    
class CardListUpdate(BaseModel):
    card_list_name: str = Field(..., max_length=15, min_length=3)
    board_id: int
    
class CardListResponse(CardListBase, CardListUpdate):
   pass

class CardList(CardListBase, CardListUpdate):
    cards: List[Card] = []
    
    model_config = ConfigDict(from_attributes=True)
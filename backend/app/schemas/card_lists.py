from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Annotated
from app.schemas.cards import Card

card_list_name_type = Annotated[str, Field(min_length=3, max_length=15)]

class CardListBase(BaseModel):
    id: int
    
class CardListCreate(BaseModel):
    card_list_name: card_list_name_type
    board_id: int
    
class CardListUpdate(BaseModel):
    card_list_name: card_list_name_type
   
class CardListRead(CardListBase):
    card_list_name: card_list_name_type
    board_id: int

class CardList(CardListBase):
    card_list_name: card_list_name_type
    board_id: int
    cards: List[Card] = Field(default_factory=list)
    
    model_config = ConfigDict(from_attributes=True)
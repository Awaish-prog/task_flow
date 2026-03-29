from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.schemas.cards import Card

class CardListBase(BaseModel):
    id: int
    
class CardListCreate(BaseModel):
    name: str
    card_id: int


class CardListUpdate(BaseModel):
    name: Optional[str] = None
    card_id: Optional[int] = None


class CardList(CardListBase):
    name: str
    card: Card
    
    model_config = ConfigDict(from_attributes=True)
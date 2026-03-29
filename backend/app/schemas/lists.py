from pydantic import BaseModel, ConfigDict
from typing import Optional
from cards import Card

class ListBase(BaseModel):
    id: int
    
class ListCreate(BaseModel):
    name: str
    card_id: int


class ListUpdate(BaseModel):
    name: Optional[str] = None
    card_id: Optional[int] = None


class List(ListBase):
    name: str
    card: Card
    
    model_config = ConfigDict(from_attributes=True)
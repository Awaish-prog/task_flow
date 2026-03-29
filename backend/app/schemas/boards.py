from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.schemas.card_lists import CardList

class BoardBase(BaseModel):
    id: int
    
class BoardCreate(BaseModel):
    name: str
    card_list_id: int


class BoardUpdate(BaseModel):
    name: Optional[str] = None
    card_list_id: Optional[int] = None


class Board(BoardBase):
    name: str
    card_list: CardList
    
    model_config = ConfigDict(from_attributes=True)
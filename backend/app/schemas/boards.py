from pydantic import BaseModel, ConfigDict
from typing import List
from app.schemas.card_lists import CardList

class BoardBase(BaseModel):
    id: int
    
class BoardApi(BoardBase):
    name: str

class BoardUpdate(BaseModel):
    name: str = None

class Board(BoardBase):
    name: str
    card_lists: List[CardList] = []
    
    model_config = ConfigDict(from_attributes=True)
    
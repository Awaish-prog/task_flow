from pydantic import BaseModel, ConfigDict, Field
from typing import List
from app.schemas.card_lists import CardList

class BoardBase(BaseModel):
    id: int

class BoardUpdate(BaseModel):
    name: str = Field(..., max_length=15, min_length=3)
    
class BoardApi(BoardBase, BoardUpdate):
    pass

class Board(BoardBase, BoardUpdate):
    card_lists: List[CardList] = []
    
    model_config = ConfigDict(from_attributes=True)
    
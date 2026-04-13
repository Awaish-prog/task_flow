from pydantic import BaseModel, ConfigDict, Field
from typing import List, Annotated
from app.schemas.card_lists import CardList

board_name_type = Annotated[str, Field(min_length=3, max_length=15)]

class BoardBase(BaseModel):
    id: int

class BoardUpdate(BaseModel):
    board_name: board_name_type
    
class BoardRead(BoardBase):
    board_name: board_name_type

class Board(BoardBase):
    board_name: board_name_type
    card_lists: List[CardList] = Field(default_factory=list)
    
    model_config = ConfigDict(from_attributes=True)
    
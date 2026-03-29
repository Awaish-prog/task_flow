from pydantic import BaseModel, ConfigDict
from typing import Optional
from lists import List

class BoardBase(BaseModel):
    id: int
    
class BoardCreate(BaseModel):
    name: str
    list_id: int


class BoardUpdate(BaseModel):
    name: Optional[str] = None
    list_id: Optional[int] = None


class Board(BoardBase):
    name: str
    list: List
    
    model_config = ConfigDict(from_attributes=True)
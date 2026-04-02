from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class CardBase(BaseModel):
    id: int
    
class CardCreate(BaseModel):
    name: str
    description: str = None
    card_list_id: int


class CardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    card_list_id: Optional[int] = None


class Card(CardBase):
    name: str
    description: str = None
    card_list_id: int
    
    model_config = ConfigDict(from_attributes=True)
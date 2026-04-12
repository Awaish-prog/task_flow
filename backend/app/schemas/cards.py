from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class CardBase(BaseModel):
    id: int
    
class CardUpdate(BaseModel):
    card_name: str = Field(..., max_length=15, min_length=3)
    description: str = Field(..., max_length=50, min_length=3)
    
class CardOrderUpdate(BaseModel):
    prev_card_id: Optional[int] = None
    next_card_id: Optional[int] = None
    card_list_id: int = None
    
class CardCreateRequest(CardUpdate):
    card_list_id: int
    
class CardCreate(CardCreateRequest):
    order_key: str = None

class Card(CardBase, CardCreate):
    
    model_config = ConfigDict(from_attributes=True)
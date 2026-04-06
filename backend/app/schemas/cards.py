from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class CardBase(BaseModel):
    id: int
    
class CardCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    card_list_id: int
    
class CardCreate(CardCreateRequest):
    name: str
    description: Optional[str] = None
    card_list_id: int
    order_key: str = None
    
class CardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    card_list_id: Optional[int] = None
    
class CardOrderUpdate(BaseModel):
    prev_card_id: Optional[int] = None
    next_card_id: Optional[int] = None
    card_list_id: Optional[int] = None
    
class CardResponse(CardBase):
    name: str
    description: str = None
    card_list_id: int
    order_key: str = None
    deleted: bool = False

class Card(CardBase):
    name: str
    description: str = None
    card_list_id: int
    order_key: str = None
    deleted: bool = False
    
    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Annotated

name_type = Annotated[str, Field(min_length=3, max_length=30)]
description_type = Annotated[str, Field(min_length=3, max_length=30)]

class CardBase(BaseModel):
    id: int
    
class CardCreate(BaseModel):
    card_name: name_type
    description: description_type
    card_list_id: int
    order_key: Optional[str] = None
    
class CardUpdate(BaseModel):
    card_name: name_type
    description: description_type
    
class CardOrderUpdate(BaseModel):
    card_list_id: int
    prev_card_id: Optional[int] = None
    next_card_id: Optional[int] = None

class Card(CardBase):
    card_name: name_type
    description: description_type
    card_list_id: int
    order_key: str
    
    model_config = ConfigDict(from_attributes=True)
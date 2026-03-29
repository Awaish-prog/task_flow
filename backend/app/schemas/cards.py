from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class CardBase(BaseModel):
    id: int
    
class CardCreate(BaseModel):
    name: str
    description: str = Field(..., max_length=5)


class CardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = Field(..., max_length=5)


class Card(CardBase):
    name: str
    description: str = Field(..., max_length=5)
    
    model_config = ConfigDict(from_attributes=True)
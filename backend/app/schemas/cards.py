from pydantic import BaseModel, ConfigDict
from typing import Optional

class CardBase(BaseModel):
    id: int
    
class CardCreate(BaseModel):
    name: str
    description: str


class CardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class Card(CardBase):
    name: str
    description: str
    
    model_config = ConfigDict(from_attributes=True)
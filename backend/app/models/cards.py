from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class Card(Base):
    __tablename__ = "cards"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String)
    card_list_id = Column(Integer, ForeignKey("card_lists.id"))
    
    card_list = relationship("CardList", back_populates="cards")
    
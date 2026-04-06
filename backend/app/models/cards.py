from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.models.mixins.soft_delete import SoftDeleteMixin


class Card(Base, SoftDeleteMixin):
    __tablename__ = "cards"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    order_key = Column(String, nullable=False)
    card_list_id = Column(Integer, ForeignKey("card_lists.id"))
    
    card_list = relationship("CardList", back_populates="cards")
    
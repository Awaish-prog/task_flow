from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.models.mixins.soft_delete import SoftDeleteMixin

class Board(Base, SoftDeleteMixin):
    __tablename__ = "boards"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    
    card_lists = relationship("CardList", back_populates="board")
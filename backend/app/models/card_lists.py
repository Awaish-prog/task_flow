from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class CardList(Base):
    __tablename__ = "card_lists"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    
    cards = relationship("Card", back_populates="card_list")
    board = relationship("Board", back_populates="card_lists")
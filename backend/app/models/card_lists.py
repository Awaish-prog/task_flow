from sqlalchemy import Column, Integer, String, ForeignKey, collate
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.models.cards import Card


class CardList(Base):
    __tablename__ = "card_lists"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    
    cards = relationship("Card", back_populates="card_list", order_by=collate(Card.order_key, "C"))
    board = relationship("Board", back_populates="card_lists")
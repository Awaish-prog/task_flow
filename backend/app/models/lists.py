from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class List(Base):
    __tablename__ = "lists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    
    cards = relationship("Card", back_populates="list")
    board = relationship("Board", back_populates="lists")
from app.models.boards import Board
from app.repositories.base import BaseRepository

class BoardRepository(BaseRepository[Board]):
    def __init__(self):
        super().__init__(Board)
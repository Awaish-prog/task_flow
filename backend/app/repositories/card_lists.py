from app.models.card_lists import CardList
from app.repositories.base import BaseRepository

class CardListRepository(BaseRepository[CardList]):
    def __init__(self):
        super().__init__(CardList)
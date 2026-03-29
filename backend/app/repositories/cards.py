from app.models.cards import Card
from app.repositories.base import BaseRepository

class CardRepository(BaseRepository[Card]):
    def __init__(self):
        super().__init__(Card)
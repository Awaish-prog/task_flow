from app.repositories.card_lists import CardListRepository
from app.services.base import BaseService

class CardListService(BaseService):
    def __init__(self):
        super().__init__(CardListRepository())
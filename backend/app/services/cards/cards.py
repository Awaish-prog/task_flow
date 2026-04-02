from app.repositories.cards import CardRepository
from app.services.base import BaseService

class CardService(BaseService):
    def __init__(self):
        super().__init__(CardRepository())
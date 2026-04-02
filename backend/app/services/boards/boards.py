from app.repositories.boards import BoardRepository
from app.services.base import BaseService

class BoardService(BaseService):
    def __init__(self):
        super().__init__(BoardRepository())
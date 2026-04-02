from app.services.boards.boards import BoardService

def get_board_service() -> BoardService:
    return BoardService()
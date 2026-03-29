from fastapi import APIRouter
from typing import List
from app.schemas.boards import Board, BoardCreate, BoardUpdate

router = APIRouter()

@router.get("/", response_model=List[Board])
def read_boards() -> List[Board]:
    return []

@router.get("/{board_id}", response_model=Board)
def read_board() -> Board:
    return None

@router.post("/", response_model=Board)
def create_board(board: BoardCreate) -> Board:
    return None

@router.put("/{board_id}", response_model=Board)
def update_board(board: BoardUpdate) -> Board:
    return None

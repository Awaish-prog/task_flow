from fastapi import APIRouter
from typing import List
from app.schemas.boards import Board, BoardBase, BoardUpdate, BoardRead
from app.api.dependencies import DBDep, BoardServiceDep

router = APIRouter()

@router.get("/", response_model=List[BoardRead])
async def read_boards(db: DBDep, board_service: BoardServiceDep) -> List[BoardRead]:
    return await board_service.get_all(db)

@router.get("/{board_id}", response_model=Board)
async def read_board(board_id: int, db: DBDep, board_service: BoardServiceDep) -> Board:
    return await board_service.get(db, board_id)

@router.post("/", response_model=BoardRead)
async def create_board(board: BoardUpdate, db: DBDep, board_service: BoardServiceDep) -> BoardRead:
    return await board_service.create(db, board)

@router.put("/{board_id}", response_model=BoardRead)
async def update_board(board_id: int, board: BoardUpdate, db: DBDep, board_service: BoardServiceDep) -> BoardRead:
    return await board_service.update(db, board_id, board)

@router.delete("/{board_id}", response_model=None)
async def read_board(board_id: int, db: DBDep, board_service: BoardServiceDep) -> None:
    return await board_service.delete(db, board_id)
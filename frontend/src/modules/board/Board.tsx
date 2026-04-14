import { useState } from "react";
import EditableField from "../../shared/ui/EditableField.tsx";
import { useBoard, useDeleteBoard, useUpdateBoard } from "../../api/boards/query";
import { useCreateCardList } from "../../api/cardLists/query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import type { CardListData } from "../cardList/types.ts"

import {
  DragDropContext,
  type DropResult,
} from "@hello-pangea/dnd";
import { useMoveCard } from "../../api/cards/query";
import CardList from "../cardList/CardList";
import BoardLoader from "./BoardLoader";

export default function Board({ boardId, setDefaultBoard }: { boardId: number, setDefaultBoard: (deletedBoardId: number) => void }) {
  const { data: board, isLoading } = useBoard(boardId);
  const updateBoardMutation = useUpdateBoard();
  const createCardListMutation = useCreateCardList();
  const moveCard = useMoveCard();
  const deleteBoard = useDeleteBoard();

  const [isAdding, setIsAdding] = useState(false);
  const [listName, setListName] = useState("");

  if (isLoading || !board) return <BoardLoader />;

  const handleUpdateName = (name: string) => {
    updateBoardMutation.mutate({ id: board.id, name });
  };

  const handleCreateList = () => {

    createCardListMutation.mutate(
      { boardId, name: listName },
      {
        onSuccess: () => {
          setListName("");
          setIsAdding(false);
        },
      }
    );
  };

  const onDragEnd = (result: DropResult) => {
    const sourceCardListId: number = Number(result.source?.droppableId)
    const destinationListId: number = Number(result.destination?.droppableId)

    const destinationCardList: CardListData | undefined = board.cardLists.find((cardList: CardListData) => cardList.id === destinationListId)

    if (destinationCardList === undefined || result.destination === null || result.destination.index === null) {
      return;
    }
    const destinationIndex = result.destination.index

    const prevCardId: number | null | undefined = destinationIndex !== undefined && destinationIndex > 0 ?
      destinationCardList.cards[destinationIndex - 1]?.id :
      null

    const nextCardId: number | null | undefined = destinationIndex !== undefined && destinationIndex < destinationCardList.cards.length ?
      destinationCardList.cards[destinationIndex]?.id :
      null

    moveCard.mutate(
      {
        cardId: Number(result.draggableId),
        cardListId: destinationListId,
        prevCardId,
        nextCardId,
        sourceCardListId,
        boardId: boardId,
        destCardIndex: destinationIndex
      }
    )
  }

  const handleBoardDelete = async () => {
    await deleteBoard.mutateAsync(boardId);
    setDefaultBoard(boardId);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1 group">
          <h1 className="text-4xl font-semibold text-gray-800 flex items-center gap-3 group">
            <div className="flex items-center">
              <EditableField value={board.boardName} onSave={handleUpdateName} />
            </div>

            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded flex items-center bg-gray-200 hover:bg-red-100 cursor-pointer w-[23px] h-[23px] justify-center"
              onClick={handleBoardDelete}>
              <DeleteOutlineIcon sx={{ fontSize: 17 }} className="text-red-500" titleAccess="Delete board" />
            </button>
          </h1>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4">
          {board.cardLists.map((cardList: CardListData, index: number) => (
            <CardList
              key={index}
              id={cardList.id}
              boardId={boardId}
              cardList={cardList}
            />
          ))}

          <div className="w-[280px] flex-shrink-0">
            {isAdding ? (
              <div className="bg-white rounded-md p-4 shadow-md border border-gray-200 w-[280px]">
                <div className="flex flex-col gap-3">
    
                <input
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter list name..."
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  autoFocus/>

                <div className="flex items-center gap-2">
                  <button onClick={handleCreateList}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm shadow-sm transition disabled:opacity-50 cursor-pointer">
                    Add List
                  </button>
                  <button onClick={() => setIsAdding(false)} className="text-sm px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                    Cancel
                  </button>
                </div>

              </div>
            </div>
            ) : (
              <div onClick={() => setIsAdding(true)}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition rounded-sm cursor-pointer flex-shrink-0">
                <AddIcon className="text-gray-600" fontSize="small" titleAccess="Add list" />
              </div>
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );

}
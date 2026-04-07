import { Stack, Box, Button, TextField, Paper } from "@mui/material";
import { useState } from "react";
import EditableField from "./ui/EditableField";
import { useBoard, useUpdateBoard } from "../api/boards/query";
import { useCreateCardList } from "../api/cardLists/query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";

// import { DragDropContext, type DropResult } from "react-beautiful-dnd";

import { useQueryClient } from "@tanstack/react-query";
import type { CardListData } from "../types/Types";

import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useMoveCard } from "../api/cards/query";
import CardList from "./CardList";

export default function Board({ boardId }: { boardId: number }) {
  const { data: board, isLoading } = useBoard(boardId);
  const updateBoardMutation = useUpdateBoard();
  const createCardListMutation = useCreateCardList();
  const moveCard = useMoveCard();
  const queryClient = useQueryClient();

  const [isAdding, setIsAdding] = useState(false);
  const [listName, setListName] = useState("");

  if (isLoading || !board) return <div>Loading...</div>;

  const handleUpdateName = (name: string) => {
    updateBoardMutation.mutate({ id: board.id, name });
  };

  const handleCreateList = () => {
    if (!listName.trim()) return;

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

//   const onDragEnd = (result: DropResult) => {
//   const { source, destination } = result;

//   if (!destination) return;

//   // same position → do nothing
//   if (
//     source.droppableId === destination.droppableId &&
//     source.index === destination.index
//   ) {
//     return;
//   }

//   const newLists = [...board.cardLists];

//   const sourceList = newLists.find(
//     (l) => l.id.toString() === source.droppableId
//   );

//   const destList = newLists.find(
//     (l) => l.id.toString() === destination.droppableId
//   );

//   if (!sourceList || !destList) return;

//   const sourceCards = [...sourceList.cards];
//   const [movedCard] = sourceCards.splice(source.index, 1);

//   if (sourceList.id === destList.id) {
//     // same list
//     sourceCards.splice(destination.index, 0, movedCard);
//     sourceList.cards = sourceCards;
//   } else {
//     // different list
//     const destCards = [...destList.cards];
//     destCards.splice(destination.index, 0, movedCard);

//     sourceList.cards = sourceCards;
//     destList.cards = destCards;
//   }

//   // 🔥 update cache manually
//   queryClient.setQueryData(["board", boardId], {
//     ...board,
//     cardLists: newLists,
//   });
// };


  const onDragEnd = (result: DropResult) => {
    const sourceCardListId: number = Number(result.source?.droppableId)
    const destinationListId: number = Number(result.destination?.droppableId)

    const destinationCardList: CardListData | undefined = board.cardLists.find(cardList => cardList.id === destinationListId)

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

  return (
  <DragDropContext onDragEnd={onDragEnd}>
    <div className="flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-5xl font-semibold text-gray-800">
          <EditableField value={board.name} onSave={handleUpdateName} />
        </h1>
      </div>

      {/* Lists */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {board.cardLists.map((cardList, index) => (
          <CardList
            key={cardList.id}
            id={cardList.id}
            boardId={boardId}
            cardList={cardList}
            index={index}
          />
        ))}

        {/* Add List */}
        <div className="w-[280px] flex-shrink-0">
          {isAdding ? (
            <div className="bg-gray-100 rounded-sm p-3 shadow-sm">
              <div className="flex flex-col gap-2">
                <input
                  className="w-full px-2 py-1.5 text-sm border rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateList}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-sm text-sm hover:bg-blue-700"
                  >
                    Add List
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
  onClick={() => setIsAdding(true)}
  className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition rounded-sm cursor-pointer flex-shrink-0"
>
  <AddIcon className="text-gray-600" fontSize="small" />
</div>
          )}
        </div>
      </div>
    </div>
  </DragDropContext>
);

}
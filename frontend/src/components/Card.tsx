import { Paper, Stack, Box } from "@mui/material";
import EditableField from "./ui/EditableField";
import type { Card as CardType } from "../types/Types";
import { useDeleteCard, useUpdateCard } from "../api/cards/query";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Draggable } from "@hello-pangea/dnd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function Card({
  id,
  boardId,
  card,
  index
}: {
  id: number;
  boardId: number;
  card: CardType;
  index: number
}) {
  const updateCardMutation = useUpdateCard();
  const deleteCard = useDeleteCard()


  if (!card) return null;

  const handleUpdateName = (name: string) => {
    updateCardMutation.mutate({
      id,
      name,
      boardId,
      description: card.description,
    });
  };

  const handleUpdateDescription = (description: string) => {
    updateCardMutation.mutate({
      id,
      description,
      boardId,
      name: card.cardName,
    });
  };


  const handleCardDelete = () => {
    deleteCard.mutateAsync({ cardListId: card.cardListId, boardId, cardId: card.id });
  }

  return (
  <Draggable draggableId={card.id.toString()} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <div
          className={`bg-white rounded-sm p-3 shadow-sm hover:shadow-md transition cursor-pointer ${
            snapshot.isDragging ? "shadow-lg" : ""
          }`}
        >
          <div className="text-[18px] flex flex-col gap-1 group/card">
            <EditableField value={card.cardName} onSave={handleUpdateName} />

            {card.description && (
              <div className="text-gray-500 leading-relaxed">
                <EditableField value={card.description} onSave={handleUpdateDescription} />
              </div>
            )}
            <button
              className="p-1 rounded bg-gray-300 w-[30px] flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-100 cursor-pointer"
              onClick={handleCardDelete}
            >
              <DeleteOutlineIcon className="text-red-500" fontSize="small" titleAccess="Delete card" />
            </button>
          </div>
        </div>
      </div>
    )}
  </Draggable>
);
}
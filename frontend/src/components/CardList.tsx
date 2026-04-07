import { Paper, Stack, Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import Card from "./Card";
import EditableField from "./ui/EditableField";
import type { CardListData } from "../types/Types";
import { useUpdateCardList } from "../api/cardLists/query";
import { useCreateCard } from "../api/cards/query";
import AddIcon from "@mui/icons-material/Add";

// import { Droppable } from "react-beautiful-dnd";

import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";

export default function CardList({
  id,
  boardId,
  cardList,
  index
}: {
  id: number;
  boardId: number;
  cardList: CardListData;
  index: number
}) {
  const { mutate: updateCardListName } = useUpdateCardList();
  const { mutate: createCard } = useCreateCard();

  const [isAdding, setIsAdding] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  if (!cardList) return null;

  const handleSave = (name: string) => {
    updateCardListName({ id, name });
  };

  const handleAddCard = () => {
    if (!cardName.trim()) return;

    createCard(
      {
        name: cardName,
        description: cardDescription,
        cardListId: id,
        boardId,
      },
      {
        onSuccess: () => {
          setCardName("");
          setCardDescription("");
          setIsAdding(false);
        },
      }
    );
  };

    return (
  <div className="w-[90vw] max-w-[340px] max-h-[80vh] flex flex-col bg-gray-100 rounded-sm p-1 flex-shrink-0">
    
    {/* Header */}
    <div className="text-1xl px-1 py-1 ml-2">
      <EditableField value={cardList.name} onSave={handleSave} />
      <p>{cardList.id}</p>
    </div>

    {/* Cards */}
    <Droppable droppableId={cardList.id.toString()}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col gap-2 mt-2 overflow-y-auto pr-1"
        >
          {cardList.cards.map((card, index) => (
            <Card
              key={card.id}
              id={card.id}
              boardId={boardId}
              card={card}
              index={index}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>

    {/* Add Card */}
    <div className="mt-2">
      {isAdding ? (
        <div className="bg-white rounded-sm p-2 shadow-sm">
          <div className="flex flex-col gap-2">
            <input
              className="px-2 py-1.5 text-sm border rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Card title"
              autoFocus
            />
            <textarea
              className="px-2 py-1.5 text-sm border rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              placeholder="Description"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-sm text-sm hover:bg-blue-700"
              >
                Add
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
        <div className="flex justify-center">
  <button
    onClick={() => setIsAdding(true)}
    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition rounded-sm"
  >
    <AddIcon className="text-gray-700" fontSize="small" />
  </button>
</div>
      )}
    </div>
  </div>
);

}
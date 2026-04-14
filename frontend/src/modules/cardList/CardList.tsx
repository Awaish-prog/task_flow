import { useState } from "react";
import Card from "../card/Card";
import EditableField from "../../shared/ui/EditableField.tsx";
import type { CardListData } from "../cardList/types.ts";
import { useDeleteCardList, useUpdateCardList } from "../../api/cardLists/query";
import { useCreateCard } from "../../api/cards/query";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Droppable } from "@hello-pangea/dnd";

export default function CardList({ id, boardId, cardList }: { id: number; boardId: number; cardList: CardListData }) {
  const { mutate: updateCardListName } = useUpdateCardList();
  const { mutate: createCard } = useCreateCard();
  const deleteCardList = useDeleteCardList();

  const [isAdding, setIsAdding] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  if (!cardList) return null;

  const handleSave = (name: string) => {
    updateCardListName({ id, name });
  };

  const handleAddCard = () => {

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

  const handleCardListDelete = () => {
    deleteCardList.mutateAsync({ cardListId: cardList.id, boardId });
  }

    return (
      <div className="w-[90vw] max-w-[280px] flex flex-col bg-gray-100 rounded-sm p-1 flex-shrink-0">
        <div className="text-[20px] px-1 py-1 ml-2 flex items-center group/card-list gap-2 w-full">
          <div className="flex-1 min-w-0">
            <EditableField value={cardList.cardListName} onSave={handleSave} />
          </div>

          <button className="p-1 rounded hover:bg-red-100 bg-gray-200 w-[23px] h-[23px] opacity-0 group-hover/card-list:opacity-100 transition-opacity flex justify-center items-center cursor-pointer shrink-0 mr-2" onClick={handleCardListDelete}>
            <DeleteOutlineIcon className="text-red-500" sx={{ fontSize: 17 }} />
          </button>
        </div>

        <Droppable droppableId={cardList.id.toString()}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 mt-2 overflow-y-auto px-1">
              {cardList.cards.map((card, index) => (
                <Card key={card.id} id={card.id} boardId={boardId} card={card} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="mt-2">
          {isAdding ? (
            <div className="bg-white rounded-sm p-2 shadow-sm">
              <div className="flex flex-col gap-2">
                <input
                  className="px-2 py-1.5 text-sm border rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Card title"
                  autoFocus />
                <textarea
                  className="px-2 py-1.5 text-sm border rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  placeholder="Description"
                  rows={2} />
                <div className="flex gap-2">
                  <button onClick={handleAddCard} className="bg-blue-600 text-white px-3 py-1.5 rounded-sm text-sm hover:bg-blue-700 cursor-pointer">
                    Add
                  </button>
                  <button onClick={() => setIsAdding(false)} className="text-sm text-gray-600 hover:text-black cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
        <div className="flex justify-center">
          <button onClick={() => setIsAdding(true)} className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition rounded-sm cursor-pointer m-2">
            <AddIcon className="text-gray-700" fontSize="small" titleAccess="Add card" />
          </button>
        </div>
        )}
      </div>
    </div>
  );
}
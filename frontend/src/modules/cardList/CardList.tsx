import { Droppable } from "@hello-pangea/dnd";
import type { CardListData } from "./types";
import { CardListHeader } from "./components/CardListHeader.tsx";
import { AddCardForm } from "./components/AddCardForm.tsx";
import Card from "../card/Card.tsx";

export default function CardList({id, boardId, cardList}: {
  id: number;
  boardId: number;
  cardList: CardListData;
}) {
  if (!cardList) return null;

  return (
    <div className="w-[90vw] max-w-[280px] flex flex-col bg-gray-100 rounded-sm p-1 flex-shrink-0">
      <CardListHeader
        id={id}
        name={cardList.cardListName}
        boardId={boardId}
      />

      <Droppable droppableId={cardList.id.toString()}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2 mt-2 overflow-y-auto px-1"
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

      <AddCardForm boardId={boardId} cardListId={id} />
    </div>
  );
}
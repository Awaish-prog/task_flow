import { Draggable } from "@hello-pangea/dnd";
import type { Card as CardType } from "./types";
import { useCardActions } from "./hooks/useCardActions.ts";
import { CardContent } from "./components/CardContent.tsx";
import { CardDeleteButton } from "./components/CardDeleteButton.tsx";

export default function Card({
  id,
  boardId,
  card,
  index,
}: {
  id: number;
  boardId: number;
  card: CardType;
  index: number;
}) {
  const { updateName, updateDescription, remove } = useCardActions(
    boardId,
    id,
    card.cardName,
    card.description
  );

  if (!card) return null;

  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={`bg-white rounded-sm p-3 shadow-sm hover:shadow-md transition group/card ${
              snapshot.isDragging ? "shadow-lg" : ""
            }`}
          >
            <CardContent
              name={card.cardName}
              description={card.description}
              onNameChange={updateName}
              onDescriptionChange={updateDescription}
            />

            <CardDeleteButton onDelete={remove} />
          </div>
        </div>
      )}
    </Draggable>
  );
}
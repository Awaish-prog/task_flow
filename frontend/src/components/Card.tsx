import { Paper, Stack } from "@mui/material";
import EditableField from "./ui/EditableField";
import type { Card as CardType } from "../types/Types";
import { useUpdateCard } from "../api/cards/query";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
// import { Draggable } from "react-beautiful-dnd";
import { Draggable } from "@hello-pangea/dnd";

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
      name: card.name,
    });
  };

  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
        <Paper sx={{ p: 2 }}
    >
      <Stack spacing={1}>
        <EditableField value={card.name} onSave={handleUpdateName} />
        <EditableField
          value={card.description}
          onSave={handleUpdateDescription}
        />
        <p>{card.orderKey}</p>
      </Stack>
    </Paper>
    </div>
      )}
    
    </Draggable>
  );
}
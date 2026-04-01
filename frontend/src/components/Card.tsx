import { Paper, Stack } from "@mui/material";
import EditableField from "./ui/EditableField";
import type { Card as CardType } from "../types/Types";
import { useUpdateCard } from "../api/cards/query";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({
  id,
  boardId,
  card,
}: {
  id: number;
  boardId: number;
  card: CardType;
}) {
  const updateCardMutation = useUpdateCard();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ p: 2 }}
    >
      <Stack spacing={1}>
        <EditableField value={card.name} onSave={handleUpdateName} />
        <EditableField
          value={card.description}
          onSave={handleUpdateDescription}
        />
      </Stack>
    </Paper>
  );
}
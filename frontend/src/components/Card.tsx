import { Paper, Stack } from "@mui/material";
import EditableField from "./ui/EditableField";
import type { Card } from "../types/Types";
import { useUpdateCard } from "../api/cards/query";


export default function Card({ id, boardId, card }: { id: number, boardId: number, card: Card}) {

  const updateCardMutation = useUpdateCard();

  if (!card) return null;

  const handleUpdateName = (name: string) => {
    updateCardMutation.mutate({
      id,
      name,
      boardId,
      description: card.description
    });
  };

  const handleUpdateDescription = (description: string) => {
    updateCardMutation.mutate({
      id,
      description,
      boardId,
      name: card.name
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        <EditableField value={card.name} onSave={handleUpdateName} />

        <EditableField
          value={card.description}
          onSave={handleUpdateDescription}
        />

        <Stack direction="row" justifyContent="flex-end">
        </Stack>
      </Stack>
    </Paper>
  );
}
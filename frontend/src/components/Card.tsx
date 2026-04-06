import { Paper, Stack, Box } from "@mui/material";
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
      <Box
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Paper
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "white",
            boxShadow: snapshot.isDragging ? 3 : 1,
            cursor: "pointer",
            "&:hover": { boxShadow: 3 },
          }}
        >
          <Stack spacing={0.5}>
            <EditableField value={card.name} onSave={handleUpdateName} />

            {card.description && (
              <Box
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                  lineHeight: 1.4,
                }}
              >
                {card.description}
              </Box>
            )}
          </Stack>
        </Paper>
      </Box>
    )}
  </Draggable>
);
}
import { Paper, Stack, Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import Card from "./Card";
import EditableField from "./ui/EditableField";
import type { CardListData } from "../types/Types";
import { useUpdateCardList } from "../api/cardLists/query";
import { useCreateCard } from "../api/cards/query";

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
  <Paper
    sx={{
      width: 280,
      maxHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      bgcolor: "#f4f5f7",
      borderRadius: 3,
      p: 1.5,
      flexShrink: 0,
    }}
  >
    {/* List Header */}
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <EditableField value={cardList.name} onSave={handleSave} />
    </Box>

    {/* Cards */}
    <Droppable droppableId={cardList.id.toString()}>
      {(provided: any) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
            maxHeight: "60vh",
            pr: 0.5,
          }}
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
        </Box>
      )}
    </Droppable>

    {/* Add Card */}
    <Box mt={1}>
      {isAdding ? (
        <Paper sx={{ p: 1.5, borderRadius: 2 }}>
          <Stack spacing={1}>
            <TextField
              size="small"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Card title"
              autoFocus
            />
            <TextField
              size="small"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              placeholder="Description"
              multiline
              minRows={2}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleAddCard}
                sx={{ textTransform: "none" }}
              >
                Add
              </Button>
              <Button onClick={() => setIsAdding(false)}>Cancel</Button>
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <Button
          fullWidth
          onClick={() => setIsAdding(true)}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            color: "text.secondary",
          }}
        >
          + Add a card
        </Button>
      )}
    </Box>
  </Paper>
);


}
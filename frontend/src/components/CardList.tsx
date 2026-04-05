import { Paper, Stack, Button, TextField } from "@mui/material";
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
}: {
  id: number;
  boardId: number;
  cardList: CardListData;
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
    <Paper sx={{ width: 300, p: 2 }}>
      <Stack spacing={2}>
        <EditableField value={cardList.name} onSave={handleSave} />

        <Droppable droppableId={cardList.id.toString()}>
          {(provided: any) => (
            <div
            ref={provided.innerRef}
              {...provided.droppableProps}>

          {cardList.cards.map((card, index) => (
            <Card key={card.id} id={card.id} boardId={boardId} card={card} index={index} />
          ))}
        {provided.placeholder}
        </div>
          )}
        </Droppable>

        {isAdding ? (
          <Stack spacing={1}>
            <TextField
              size="small"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Enter card title"
            />
            <TextField
              size="small"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              placeholder="Enter description"
              multiline
              minRows={2}
            />
            <Button variant="contained" onClick={handleAddCard}>
              Add
            </Button>
            <Button onClick={() => setIsAdding(false)}>Cancel</Button>
          </Stack>
        ) : (
          <Button variant="outlined" onClick={() => setIsAdding(true)}>
            + Add Card
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
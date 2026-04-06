import { Stack, Box, Button, TextField, Paper } from "@mui/material";
import { useState } from "react";
import CardList from "./CardList";
import EditableField from "./ui/EditableField";
import { useBoard, useUpdateBoard } from "../api/boards/query";
import { useCreateCardList } from "../api/cardLists/query";

// import { DragDropContext, type DropResult } from "react-beautiful-dnd";

import { useQueryClient } from "@tanstack/react-query";
import type { BoardData, Card, CardListData } from "../types/Types";

import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useMoveCard } from "../api/cards/query";

export default function Board({ boardId }: { boardId: number }) {
  const { data: board, isLoading } = useBoard(boardId);
  const updateBoardMutation = useUpdateBoard();
  const createCardListMutation = useCreateCardList();
  const moveCard = useMoveCard();
  const queryClient = useQueryClient();

  const [isAdding, setIsAdding] = useState(false);
  const [listName, setListName] = useState("");

  if (isLoading || !board) return <div>Loading...</div>;

  const handleUpdateName = (name: string) => {
    updateBoardMutation.mutate({ id: board.id, name });
  };

  const handleCreateList = () => {
    if (!listName.trim()) return;

    createCardListMutation.mutate(
      { boardId, name: listName },
      {
        onSuccess: () => {
          setListName("");
          setIsAdding(false);
        },
      }
    );
  };

//   const onDragEnd = (result: DropResult) => {
//   const { source, destination } = result;

//   if (!destination) return;

//   // same position → do nothing
//   if (
//     source.droppableId === destination.droppableId &&
//     source.index === destination.index
//   ) {
//     return;
//   }

//   const newLists = [...board.cardLists];

//   const sourceList = newLists.find(
//     (l) => l.id.toString() === source.droppableId
//   );

//   const destList = newLists.find(
//     (l) => l.id.toString() === destination.droppableId
//   );

//   if (!sourceList || !destList) return;

//   const sourceCards = [...sourceList.cards];
//   const [movedCard] = sourceCards.splice(source.index, 1);

//   if (sourceList.id === destList.id) {
//     // same list
//     sourceCards.splice(destination.index, 0, movedCard);
//     sourceList.cards = sourceCards;
//   } else {
//     // different list
//     const destCards = [...destList.cards];
//     destCards.splice(destination.index, 0, movedCard);

//     sourceList.cards = sourceCards;
//     destList.cards = destCards;
//   }

//   // 🔥 update cache manually
//   queryClient.setQueryData(["board", boardId], {
//     ...board,
//     cardLists: newLists,
//   });
// };


  const onDragEnd = (result: DropResult) => {
    console.log(result)

    const sourceCardListIndex: number = Number(result.source?.droppableId)
    const destinationListIndex: number = Number(result.destination?.droppableId)

    const sourceCardListId: number = board.cardLists[sourceCardListIndex].id
    const destinationListId: number = board.cardLists[destinationListIndex].id

    const destinationIndex = result.destination?.index
    console.log(board)
    console.log(destinationListId)
    const prevCardId: number | null = destinationIndex && destinationIndex > 0 ?
      board.cardLists[destinationListIndex].cards[destinationIndex - 1].id :
      null
    const nextCardId: number | null = destinationIndex != undefined && destinationIndex < board.cardLists[destinationListIndex].cards.length ?
      board.cardLists[destinationListIndex].cards[destinationIndex].id :
      null
    console.log({
      destinationIndex,
      cardId: Number(result.draggableId),
      cardListId: destinationListId,
      prevCardId,
      nextCardId,
      sourceCardListId
    })
    moveCard.mutate(
      {
        cardId: Number(result.draggableId),
        cardListId: destinationListId,
        prevCardId,
        nextCardId,
        sourceCardListId,
        boardId: boardId
      }
    )
  }

  return (
  <DragDropContext onDragEnd={onDragEnd}>
    <Stack spacing={2}>
      {/* Board Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <EditableField value={board.name} onSave={handleUpdateName} />
      </Box>

      {/* Lists Wrapper */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          alignItems: "flex-start",
          pb: 2,
        }}
      >
        {board.cardLists.map((cardList, index) => (
          <CardList
            key={cardList.id}
            id={cardList.id}
            boardId={boardId}
            cardList={cardList}
            index={index}
          />
        ))}

        {/* Add List (fixed clean style like Jira) */}
        <Box
          sx={{
            minWidth: 280,
            flexShrink: 0,
          }}
        >
          {isAdding ? (
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#f4f5f7",
              }}
            >
              <Stack spacing={1.5}>
                <TextField
                  size="small"
                  placeholder="List name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  autoFocus
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleCreateList}
                    disabled={createCardListMutation.isPending}
                    sx={{ textTransform: "none" }}
                  >
                    Add List
                  </Button>
                  <Button onClick={() => setIsAdding(false)}>Cancel</Button>
                </Stack>
              </Stack>
            </Paper>
          ) : (
            <Paper
              onClick={() => setIsAdding(true)}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#f4f5f7",
                cursor: "pointer",
                "&:hover": { bgcolor: "#ebecf0" },
              }}
            >
              + Add another list
            </Paper>
          )}
        </Box>
      </Box>
    </Stack>
  </DragDropContext>
);

}
import { Stack, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import CardList from "./CardList";
import EditableField from "./ui/EditableField";
import { useBoard, useUpdateBoard } from "../api/boards/query";
import { useCreateCardList } from "../api/cardLists/query";

import {
  DndContext,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";

import { useQueryClient } from "@tanstack/react-query";
import { findListByCardId, moveCard } from "./ui/DndUtils";
import type { BoardData, Card, CardListData } from "../types/Types";

export default function Board({ boardId }: { boardId: number }) {
  const { data: board, isLoading } = useBoard(boardId);
  const updateBoardMutation = useUpdateBoard();
  const createCardListMutation = useCreateCardList();
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    if (activeId === overId) return;

    queryClient.setQueryData(["board", boardId], (old: BoardData) => {
      if (!old) return old;
      return moveCard(old, activeId, overId);
    });

    // TODO: persist order to backend here
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    queryClient.setQueryData(["board", boardId], (old: BoardData) => {
      if (!old) return old;

      const boardCopy = structuredClone(old);

      let activeList = findListByCardId(boardCopy, activeId);
      let overList;

      if (String(over.id).startsWith("list-")) {
        const listId = Number(String(over.id).replace("list-", ""));
        overList = boardCopy.cardLists.find((cardList: CardListData) => cardList.id === listId);
      } else {
        overList = findListByCardId(boardCopy, overId);
      }

      if (!activeList || !overList) return old;

      if (activeList.id !== overList.id) {
        const activeIndex = activeList.cards.findIndex(
          (c: Card) => c.id === activeId
        );

        const overIndex =
          overList.cards.findIndex((card: Card) => card.id === overId) >= 0
            ? overList.cards.findIndex((card: Card) => card.id === overId)
            : overList.cards.length;

        const [moved] = activeList.cards.splice(activeIndex, 1);
        overList.cards.splice(overIndex, 0, moved);
      }

      return boardCopy;
    });
  };

  return (
    <Stack spacing={3}>
      <EditableField value={board.name} onSave={handleUpdateName} />

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <Box display="flex" gap={2} overflow="auto">
          {board.cardLists.map((cardList) => (
            <CardList
              key={cardList.id}
              id={cardList.id}
              boardId={boardId}
              cardList={cardList}
            />
          ))}

          <Box minWidth={250}>
            {isAdding ? (
              <Stack spacing={1}>
                <TextField
                  size="small"
                  placeholder="Enter list name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  autoFocus
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleCreateList}
                    disabled={createCardListMutation.isPending}
                  >
                    Add
                  </Button>
                  <Button onClick={() => setIsAdding(false)}>Cancel</Button>
                </Stack>
              </Stack>
            ) : (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setIsAdding(true)}
              >
                + Add List
              </Button>
            )}
          </Box>
        </Box>
      </DndContext>
    </Stack>
  );
}
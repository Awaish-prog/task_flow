import { Stack, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import CardList from "./CardList";
import EditableField from "./ui/EditableField";
import { useBoard, useUpdateBoard } from "../api/boards/query";
import { useCreateCardList } from "../api/cardLists/query";

export default function Board({ boardId }: { boardId: number }) {
  const { data: board, isLoading } = useBoard(boardId);
  const updateBoardMutation = useUpdateBoard();
  const createCardListMutation = useCreateCardList();

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

  return (
    <Stack spacing={3}>
      <EditableField value={board.name} onSave={handleUpdateName} />

      <Box display="flex" gap={2} overflow="auto">
        {board.cardLists.map((cardList) => (
          <CardList key={cardList.id} id={cardList.id} boardId={boardId} cardList={cardList} />
        ))}

        {/* Add List Section */}
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
    </Stack>
  );
}
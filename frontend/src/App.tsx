import { useState, useEffect } from "react";
import Board from "./components/Board";
import { useBoards, useCreateBoard } from "./api/boards/query";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";


function App() {
  const { data: boards = [], isLoading } = useBoards();
  const createBoardMutation = useCreateBoard();

  const [selectedBoardId, setSelectedBoardId] = useState<number | "">("");
  const [open, setOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  // Set first board as default
  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;

    const newBoard = await createBoardMutation.mutateAsync(newBoardName);

    setNewBoardName("");
    setOpen(false);
    setSelectedBoardId(newBoard.id);
  };

  return (
    <Box p={3}>
      {/* Top Controls */}
      <Box display="flex" gap={2} alignItems="center">
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="board-select-label">Board</InputLabel>
          <Select
            labelId="board-select-label"
            value={selectedBoardId}
            label="Board"
            onChange={(e) => setSelectedBoardId(Number(e.target.value))}
            disabled={isLoading}
          >
            {boards.map((board: any) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Board
        </Button>
      </Box>

      {/* Create Board Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Board</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Board Name"
            fullWidth
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateBoard}
            variant="contained"
            disabled={createBoardMutation.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Board View */}
      {selectedBoardId && (
        <Box mt={3}>
          <Board boardId={selectedBoardId} />
        </Box>
      )}
    </Box>
  );
}

export default App;
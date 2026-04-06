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
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >

      <Box display="flex" gap={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="board-select-label">Select Board</InputLabel>
          <Select
            labelId="board-select-label"
            value={selectedBoardId}
            label="Select Board"
            onChange={(e) => setSelectedBoardId(Number(e.target.value))}
            disabled={isLoading}
            sx={{
              borderRadius: 2,
            }}
          >
            {boards.map((board: any) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          px: 2.5,
          py: 1,
          fontWeight: 500,
        }}
      >
        + New Board
      </Button>
    </Box>

    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Create New Board
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Board Name"
          fullWidth
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          variant="outlined"
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={() => setOpen(false)}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateBoard}
          variant="contained"
          disabled={createBoardMutation.isPending}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2,
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>

    {selectedBoardId && (
      <Box mt={2}>
        <Board boardId={selectedBoardId} />
      </Box>
    )}
  </Box>
);
}

export default App;
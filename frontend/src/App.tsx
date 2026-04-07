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
  <div className="p-4">
    
    {/* Top Bar */}
    <div className="flex items-center justify-end gap-2 mb-4 px-1">
      
      {/* Board Select */}
      <div>
        <FormControl size="small">
          <Select
            value={selectedBoardId}
            onChange={(e) => setSelectedBoardId(Number(e.target.value))}
            disabled={isLoading}
            displayEmpty
            className="min-w-[200px] bg-white rounded-sm text-sm"
          >
            <MenuItem value="" disabled>
              Select Board
            </MenuItem>
            {boards.map((board: any) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* New Board Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-sm font-medium transition"
      >
        + New Board
      </button>
    </div>

    {/* Dialog */}
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: 12,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Create New Board
      </DialogTitle>

      <DialogContent>
        <input
          autoFocus
          placeholder="Board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="w-full mt-2 px-3 py-2 border rounded-sm text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </DialogContent>

      <DialogActions className="px-4 pb-3">
        <button
          onClick={() => setOpen(false)}
          className="text-sm text-gray-600 hover:text-black"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateBoard}
          disabled={createBoardMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-sm"
        >
          Create
        </button>
      </DialogActions>
    </Dialog>

    {/* Board */}
    {selectedBoardId && (
      <div className="mt-3">
        <Board boardId={selectedBoardId} />
      </div>
    )}
  </div>
);
}

export default App;
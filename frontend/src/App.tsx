import { useState, useEffect } from "react";
import Board from "./components/Board";
import { useBoards, useCreateBoard } from "./api/boards/query";
import { Toaster } from "react-hot-toast";

import {
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export const BOARD_ID_KEY = 'board_id';

function App() {
  const { data: boards = [], isLoading } = useBoards();
  const createBoardMutation = useCreateBoard();

  const [selectedBoardId, setSelectedBoardId] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      const boardIdInStorage: string | null = localStorage.getItem(BOARD_ID_KEY) 
      setSelectedBoardId(boardIdInStorage ? Number(boardIdInStorage) : boards[0].id);
    }
  }, [boards, selectedBoardId]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;

    const newBoard = await createBoardMutation.mutateAsync(newBoardName);

    setNewBoardName("");
    setOpen(false);
    setCurrentBoard(newBoard.id);
  };

  const setCurrentBoard = (boardId: number) => {
    setSelectedBoardId(boardId);
    boardId ? localStorage.removeItem(BOARD_ID_KEY) : localStorage.setItem(BOARD_ID_KEY, boardId.toString());
  }

  const selectDefaultBoard = (deletedBoardId: number) => {
    console.log(`current boards: ${JSON.stringify(boards)}`);
    const currentBoards = boards && boards.length ? boards.filter(board => board.id !== deletedBoardId) : [];
    setCurrentBoard(currentBoards && currentBoards.length ? currentBoards[0].id : 0);
  }

  return (
  <div className="p-4">
    <Toaster position="top-right" reverseOrder={false} />
    
    {/* Top Bar */}
    <div className="flex items-center justify-end gap-2 mb-4 px-1">
      
      {/* Board Select */}
      <div>
        <FormControl size="small">
          <Select
            value={selectedBoardId}
            onChange={(e) => setCurrentBoard(Number(e.target.value))}
            disabled={isLoading}
            displayEmpty
            className="min-w-[200px] bg-white rounded-sm text-sm"
          >
            <MenuItem value="" disabled>
              Select Board
            </MenuItem>
            {boards.map((board: any) => (
              <MenuItem key={board.id} value={board.id}>
                {board.boardName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-sm font-medium transition cursor-pointer"
      >
        + New Board
      </button>
    </div>
    
   <Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      px: 3,
      py: 2.5,
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: 600,
      fontSize: "20px",
      pb: 1,
    }}
  >
    Create New Board
  </DialogTitle>

  <DialogContent sx={{ pt: 1 }}>
    <input
      autoFocus
      placeholder="Enter board name..."
      value={newBoardName}
      onChange={(e) => setNewBoardName(e.target.value)}
      className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </DialogContent>

  <DialogActions className="px-1 pt-4 flex justify-end gap-2">
    <button
      onClick={() => setOpen(false)}
      className="text-sm px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer"
    >
      Cancel
    </button>

    <button
      onClick={handleCreateBoard}
      disabled={createBoardMutation.isPending}
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-md shadow-sm disabled:opacity-50 cursor-pointer"
    >
      Create
    </button>
  </DialogActions>
</Dialog>
    {selectedBoardId ? (
      <div className="mt-3">
        <Board boardId={selectedBoardId} setDefaultBoard={selectDefaultBoard} />
      </div>
    ) :
    <h1>Create a board</h1>}
  </div>
);
}

export default App;
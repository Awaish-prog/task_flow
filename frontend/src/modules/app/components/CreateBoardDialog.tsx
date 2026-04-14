import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useCreateBoard } from "../../board/api/query.ts";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (id: number) => void;
};

export const CreateBoardDialog = ({ open, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const mutation = useCreateBoard();

  const handleCreate = async () => {
    const board = await mutation.mutateAsync(name);
    onSuccess(board.id);
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth
      sx={{
          borderRadius: 4,
          px: 3,
          py: 2.5,
      }}>
      <DialogTitle sx={{
        fontWeight: 600,
        fontSize: "20px",
        pb: 1,
      }}>
        Create New Board
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <input
          autoFocus
          placeholder="Enter board name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </DialogContent>

      <DialogActions className="px-1 pt-4 flex justify-end gap-2">
        <button onClick={onClose}
        className="text-sm px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer">Cancel</button>
        <button
          onClick={handleCreate}
          disabled={mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-md shadow-sm disabled:opacity-50 cursor-pointer"
        >
          Create
        </button>
      </DialogActions>
    </Dialog>
  );
};
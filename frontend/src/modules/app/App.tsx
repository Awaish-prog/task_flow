import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useBoards } from "../board/api/query.ts";

import { BoardSelector } from "./components/BoardSelector";
import { CreateBoardDialog } from "./components/CreateBoardDialog";
import { EmptyState } from "./components/EmptyState";
import { useSelectedBoard } from "./hooks/useSelectedBoard";
import Board from "../board/Board.tsx";

function App() {
  const { data: boards = [], isLoading } = useBoards();
  const { selectedBoardId, setSelectedBoardId } = useSelectedBoard();

  const [open, setOpen] = useState(false);

  const handleBoardDelete = (deletedId: number) => {
    const remaining = boards.filter((b) => b.id !== deletedId);
    setSelectedBoardId(remaining[0]?.id ?? 0);
  };

  return (
    <div className="p-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-end gap-2 mb-4">
        <BoardSelector
          boards={boards}
          value={selectedBoardId}
          onChange={setSelectedBoardId}
          isLoading={isLoading}
        />

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-sm cursor-pointer"
        >
          + New Board
        </button>
      </div>

      <CreateBoardDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={setSelectedBoardId}
      />

      {!boards.length && !isLoading ? (
        <EmptyState />
      ) : selectedBoardId ? (
        <Board
          boardId={selectedBoardId}
          handleBoardDelete={handleBoardDelete}
        />
      ) : (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <h2>Select a board</h2>
        </div>
      )}
    </div>
  );
}

export default App;
import AddIcon from "@mui/icons-material/Add";
import { useCreateList } from "../hooks/useCreateList";

export const AddListCard = ({ boardId }: { boardId: number }) => {
  const { isAdding, setIsAdding, name, setName, create, isPending } = useCreateList(boardId);

  return (
    <div className="w-[280px] flex-shrink-0">
      {isAdding ? (
        <div className="bg-white rounded-md p-4 shadow-md border w-[280px]">
          <div className="flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter list name..."
              autoFocus
              className="w-full px-3 py-2.5 text-sm border rounded-md"
            />
            <div className="flex gap-2">
              <button
                onClick={create}
                disabled={isPending || !name.trim()}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm disabled:opacity-50 cursor-pointer"
              >
                Add List
              </button>
              <button onClick={() => setIsAdding(false)} className="text-sm px-3 py-1.5 rounded-md cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsAdding(true)}
          className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-sm cursor-pointer"
        >
          <AddIcon fontSize="small" />
        </div>
        )}
    </div>
  );
};
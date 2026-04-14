import AddIcon from "@mui/icons-material/Add";
import { useCreateCardHandler } from "../hooks/useCreateCard";

export const AddCardForm = ({boardId, cardListId}: {boardId: number; cardListId: number}) => {
  const {
    isAdding,
    setIsAdding,
    name,
    setName,
    description,
    setDescription,
    create,
    isPending,
  } = useCreateCardHandler(boardId, cardListId);

  return (
    <div className="mt-2">
      {isAdding ? (
        <div className="bg-white rounded-sm p-2 shadow-sm">
          <div className="flex flex-col gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Card title"
              autoFocus
              className="px-2 py-1.5 text-sm border rounded-sm"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={2}
              className="px-2 py-1.5 text-sm border rounded-sm"
            />

            <div className="flex gap-2">
              <button
                onClick={create}
                disabled={isPending || !name.trim() || !description.trim()}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-sm text-sm disabled:opacity-50 cursor-pointer"
              >
                Add
              </button>

              <button
                onClick={() => setIsAdding(false)}
                className="text-sm text-gray-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-sm m-2 cursor-pointer"
          >
            <AddIcon fontSize="small" />
          </button>
        </div>
      )}
    </div>
  );
};
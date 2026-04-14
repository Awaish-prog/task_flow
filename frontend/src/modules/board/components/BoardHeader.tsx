import EditableField from "../../../shared/ui/EditableField.tsx";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useUpdateBoard, useDeleteBoard } from "../api/query.ts";

export const BoardHeader = ({ id, name, onDeleted }: { id: number; name: string; onDeleted: (id: number) => void; }) => {
  const update = useUpdateBoard();
  const del = useDeleteBoard();

  const handleUpdate = (value: string) => {
    update.mutate({ id, name: value });
  };

  const handleDelete = async () => {
    await del.mutateAsync(id);
    onDeleted(id);
  };

  return (
    <div className="flex items-center justify-between px-1 group">
      <h1 className="text-4xl font-semibold text-gray-800 flex items-center gap-3">
        <EditableField value={name} onSave={handleUpdate} />
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition p-1 rounded bg-gray-200 hover:bg-red-100 w-[23px] h-[23px] flex items-center justify-center cursor-pointer"
        >
          <DeleteOutlineIcon sx={{ fontSize: 17 }} className="text-red-500" />
        </button>
      </h1>
    </div>
  );
};
import EditableField from "../../../shared/ui/EditableField.tsx";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useUpdateCardList, useDeleteCardList } from "../api/query.ts";

export const CardListHeader = ({id, name, boardId}: {id: number; name: string; boardId: number;
}) => {
  const update = useUpdateCardList();
  const del = useDeleteCardList();

  const handleSave = (value: string) => {
    update.mutate({ id, name: value });
  };

  const handleDelete = async () => {
    await del.mutateAsync({ cardListId: id, boardId });
  };

  return (
    <div className="text-[20px] px-1 py-1 ml-2 flex items-center group/card-list gap-2 w-full">
      <div className="flex-1 min-w-0">
        <EditableField value={name} onSave={handleSave} />
      </div>

      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-red-100 bg-gray-200 w-[23px] h-[23px] opacity-0 group-hover/card-list:opacity-100 transition flex justify-center items-center cursor-pointer shrink-0 mr-2"
      >
        <DeleteOutlineIcon className="text-red-500" sx={{ fontSize: 17 }} />
      </button>
    </div>
  );
};
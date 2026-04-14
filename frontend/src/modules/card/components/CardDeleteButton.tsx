import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const CardDeleteButton = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <button
      onClick={onDelete}
      className="p-1 rounded bg-gray-200 w-[23px] h-[23px] flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition hover:bg-red-100 mt-1 cursor-pointer"
    >
      <DeleteOutlineIcon sx={{ fontSize: 17 }} className="text-red-500" />
    </button>
  );
};
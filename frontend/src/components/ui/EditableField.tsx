import { useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

type EditableFieldProps = {
  value: string;
  onSave: (newValue: string) => void;
};

const EditableField = ({ value, onSave }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  const handleSave = () => {
    onSave(fieldValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFieldValue(value)
  }

  return isEditing ? (
  <div className="flex gap-2 items-center w-full min-w-0">
  <input
    className="flex-1 min-w-0 px-2 py-1 border rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
    value={fieldValue}
    onChange={(e) => setFieldValue(e.target.value)}
    autoFocus
  />
    <button
    onClick={handleSave}
    className="shrink-0 text-green-600 rounded hover:text-green-700 bg-gray-200 p-1 w-[23px] h-[23px] flex items-center cursor-pointer hover:bg-gray-300"
  >
    <CheckIcon sx={{ fontSize: 15 }} />
  </button>

  <button
    onClick={handleCancel}
    className="shrink-0 text-red-600 rounded hover:text-red-700 bg-gray-200 p-1 w-[23px] h-[23px] flex items-center rounded cursor-pointer hover:bg-gray-300"
  >
    <CloseIcon sx={{ fontSize: 15 }} />
  </button>
  </div>
) : (
  <div
    className="flex items-center justify-between group cursor-pointer gap-8"
    onClick={() => setIsEditing(true)}
  >
    <span className="font-medium">
      {value}
    </span>

    <button
    onClick={handleCancel}
    className="opacity-0 group-hover:opacity-100 text-gray-700 bg-gray-200 p-1 w-[23px] h-[23px] flex items-center rounded cursor-pointer hover:bg-gray-300"
  >
    <EditIcon sx={{ fontSize: 15 }} />
  </button>
  </div>
);
};

export default EditableField;
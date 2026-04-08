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
  <div className="flex gap-2 items-center">
    <input
      className="flex-1 min-w-0 px-2 py-1 border rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
      value={fieldValue}
      onChange={(e) => setFieldValue(e.target.value)}
      autoFocus
    />
    <button
    onClick={handleSave}
    className="text-green-600 rounded hover:text-green-700 bg-gray-300 p-1 max-h-[40px] flex items-center cursor-pointer"
  >
    <CheckIcon fontSize="small" />
  </button>

  <button
    onClick={handleCancel}
    className="text-red-600 rounded hover:text-red-700 bg-gray-300 p-1 max-h-[40px] flex items-center rounded cursor-pointer"
  >
    <CloseIcon fontSize="small" />
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
    className="opacity-0 group-hover:opacity-100 text-gray-700 bg-gray-300 p-1 max-h-[40px] flex items-center rounded cursor-pointer"
  >
    <EditIcon fontSize="small" />
  </button>
  </div>
);
};

export default EditableField;
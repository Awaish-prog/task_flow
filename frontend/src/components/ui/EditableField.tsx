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
      className="px-2 py-1 border rounded-sm outline-none focus:ring-2 focus:ring-blue-500"
      value={fieldValue}
      onChange={(e) => setFieldValue(e.target.value)}
      autoFocus
    />
    <button
    onClick={handleSave}
    className="text-green-600 hover:text-green-700"
  >
    <CheckIcon fontSize="small" />
  </button>

  <button
    onClick={handleCancel}
    className="text-red-600 hover:text-red-700"
  >
    <CloseIcon fontSize="small" />
  </button>
  </div>
) : (
  <div
    className="flex items-center justify-between group cursor-pointer gap-2"
    onClick={() => setIsEditing(true)}
  >
    <span className="font-medium">
      {value}
    </span>

    <EditIcon className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 transition text-sm" />
  </div>
);
};

export default EditableField;
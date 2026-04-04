import { useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";

type EditableFieldProps = {
  value: string;
  onSave: (newValue: string) => void;
  variant?: "h5" | "h6" | "body1" | "body2";
};

const EditableField = ({ value, onSave, variant = "h6" }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  const handleSave = () => {
    onSave(fieldValue);
    setIsEditing(false);
  };

  return isEditing ? (
    <Stack direction="row" spacing={1}>
      <TextField
        size="small"
        value={fieldValue}
        onChange={(e) => setFieldValue(e.target.value)}
      />
      <Button onClick={handleSave} variant="contained">
        Save
      </Button>
    </Stack>
  ) : (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant={variant}>{fieldValue}</Typography>
      <Button size="small" onClick={() => {
        console.log("edit called")
        setIsEditing(true)
      }}>
        Edit
      </Button>
    </Stack>
  );
};

export default EditableField;
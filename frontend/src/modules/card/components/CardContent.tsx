import EditableField from "../../../shared/ui/EditableField.tsx";

export const CardContent = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: {
  name: string;
  description?: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
}) => {
  return (
    <div className="text-[15px] flex flex-col gap-1 group/card">
      <EditableField value={name} onSave={onNameChange} />

      {description && (
        <div className="text-gray-500 leading-relaxed">
          <EditableField value={description} onSave={onDescriptionChange} />
        </div>
      )}
    </div>
  );
};
import { FormControl, Select, MenuItem } from "@mui/material";
import type { Board } from "../../board/types.ts";

type Props = {
  boards: Board[];
  value: number;
  onChange: (id: number) => void;
  isLoading: boolean;
};

export const BoardSelector = ({ boards, value, onChange, isLoading }: Props) => {
  return (
    <FormControl size="small">
      <Select
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        displayEmpty
        disabled={isLoading}
        className="min-w-[200px] bg-white rounded-sm text-sm"
      >
        <MenuItem value="" disabled>
          Select Board
        </MenuItem>

        {isLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : boards.length === 0 ? (
          <MenuItem disabled>No boards found</MenuItem>
        ) : (
          boards.map((board) => (
            <MenuItem key={board.id} value={board.id}>
              {board.boardName}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};
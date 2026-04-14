import { useEffect, useState } from "react";

export const BOARD_ID_KEY = "board_id";

const getInitialBoardId = () => {
  const value = localStorage.getItem(BOARD_ID_KEY);
  const parsed = value ? Number(value) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const useSelectedBoard = () => {
  const [selectedBoardId, setSelectedBoardId] = useState<number>(getInitialBoardId);

  useEffect(() => {
    if (selectedBoardId) {
      localStorage.setItem(BOARD_ID_KEY, selectedBoardId.toString());
    } else {
      localStorage.removeItem(BOARD_ID_KEY);
    }
  }, [selectedBoardId]);

  return { selectedBoardId, setSelectedBoardId };
};

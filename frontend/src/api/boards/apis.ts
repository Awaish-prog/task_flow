import type { Board, BoardData } from "../../modules/board/types.ts";
import apiClient from "../apiClient";
import { API_ROUTES } from "../apiUrl.ts";

const boardUrl: string = API_ROUTES.boards;

export const getBoards = (): Promise<Board[]> => {
  return apiClient.get(boardUrl);
};

export const getBoardById = (id: number): Promise<BoardData> => {
  return apiClient.get(`${boardUrl}/${id}`);
};

export const createBoard = (name: string): Promise<BoardData> => {
  return apiClient.post(boardUrl, { boardName: name });
};

export const updateBoard = (
  id: number,
  name: string
): Promise<BoardData> => {
  return apiClient.put(`${boardUrl}/${id}`, { boardName: name });
};

export const deleteBoard = (id: number): Promise<void> => {
  return apiClient.delete(`${boardUrl}/${id}`);
};
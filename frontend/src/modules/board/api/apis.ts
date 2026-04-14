import type { Board, BoardData } from "../types.ts";
import apiClient from "../../../api/apiClient.ts";
import { API_ROUTES } from "../../../api/apiUrl.ts";

export const getBoards = (): Promise<Board[]> => {
  return apiClient.get(API_ROUTES.boards);
};

export const getBoardById = (id: number): Promise<BoardData> => {
  return apiClient.get(`${API_ROUTES.boards}/${id}`);
};

export const createBoard = (name: string): Promise<BoardData> => {
  return apiClient.post(API_ROUTES.boards, { boardName: name });
};

export const updateBoard = (id: number, name: string): Promise<BoardData> => {
  return apiClient.put(`${API_ROUTES.boards}/${id}`, { boardName: name });
};

export const deleteBoard = (id: number): Promise<void> => {
  return apiClient.delete(`${API_ROUTES.boards}/${id}`);
};
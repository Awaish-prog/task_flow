import type { Board, BoardData } from "../../types/Types";
import apiClient from "../apiClient";

const boardUrl: string = '/boards';

export const getBoards = (): Promise<Board[]> => {
  return apiClient.get(boardUrl);
};

export const getBoardById = (id: number): Promise<BoardData> => {
  return apiClient.get(`${boardUrl}/${id}`);
};

export const createBoard = (name: string): Promise<BoardData> => {
  return apiClient.post(boardUrl, { name });
};

export const updateBoard = (
  id: number,
  name: string
): Promise<BoardData> => {
  return apiClient.put(`${boardUrl}/${id}`, { name });
};

export const deleteBoard = (id: number): Promise<void> => {
  return apiClient.delete(`${boardUrl}/${id}`);
};
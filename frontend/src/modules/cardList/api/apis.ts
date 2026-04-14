import type { CardList, CardListData } from "../types.ts";
import apiClient from "../../../api/apiClient.ts";
import { API_ROUTES } from "../../../api/apiUrl.ts";

export const getCardLists = (): Promise<CardList[]> => {
  return apiClient.get(API_ROUTES.cardLists);
};

export const getCardListById = (id: number): Promise<CardListData> => {
  return apiClient.get(`${API_ROUTES.cardLists}/${id}`);
};

export const createCardList = (boardId: number, name: string): Promise<CardListData> => {
  return apiClient.post(API_ROUTES.cardLists, { boardId, cardListName: name });
};

export const updateCardList = (id: number, name: string): Promise<CardList> => {
  return apiClient.put(`${API_ROUTES.cardLists}/${id}`, { cardListName: name });
};

export const deleteCardList = (id: number): Promise<void> => {
  return apiClient.delete(`${API_ROUTES.cardLists}/${id}`);
};
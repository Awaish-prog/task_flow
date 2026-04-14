import type { CardList, CardListData } from "../../modules/cardList/types.ts";
import apiClient from "../apiClient";
import { API_ROUTES } from "../apiUrl.ts";

const cardListUrl: string = API_ROUTES.cardLists;

export const getCardLists = (): Promise<CardList[]> => {
  return apiClient.get(cardListUrl);
};

export const getCardListById = (id: number): Promise<CardListData> => {
  return apiClient.get(`${cardListUrl}/${id}`);
};

export const createCardList = (
  boardId: number,
  name: string
): Promise<CardListData> => {
  return apiClient.post(cardListUrl, { boardId, cardListName: name });
};

export const updateCardList = (
  id: number,
  name: string
): Promise<CardList> => {
  return apiClient.put(`${cardListUrl}/${id}`, { cardListName: name });
};

export const deleteCardList = (id: number): Promise<void> => {
  return apiClient.delete(`${cardListUrl}/${id}`);
};
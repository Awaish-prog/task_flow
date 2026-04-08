import type { CardList, CardListData } from "../../types/Types";
import apiClient from "../apiClient";

const cardListUrl: string = '/card_lists';

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
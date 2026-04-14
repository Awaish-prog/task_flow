import type { Card } from "../../modules/card/types.ts";
import apiClient from "../apiClient";
import { API_ROUTES } from "../apiUrl.ts";


const cardUrl: string = API_ROUTES.cards;

export const getCards = (): Promise<Card[]> => {
  return apiClient.get(cardUrl);
};

export const getCardById = (id: number): Promise<Card> => {
  return apiClient.get(`${cardUrl}/${id}`);
};

export const createCard = (
  cardListId: number,
  name: string,
  description: string
): Promise<Card> => {
  return apiClient.post(cardUrl, { cardListId, cardName: name, description });
};

export const updateCard = (
  id: number,
  name: string,
  description: string
): Promise<Card> => {
  return apiClient.put(`${cardUrl}/${id}`, { cardName: name, description });
};

export const deleteCard = (id: number): Promise<void> => {
  return apiClient.delete(`${cardUrl}/${id}`);
};

export const moveCard = (id: number, prevCardId: number | null, nextCardId: number | null, cardListId: number): Promise<Card> => {
  return apiClient.patch(`${cardUrl}/move/${id}`, { prevCardId, nextCardId, cardListId })
}
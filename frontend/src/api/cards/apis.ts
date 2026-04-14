import type { Card } from "../../modules/card/types.ts";
import apiClient from "../apiClient";
import { API_ROUTES } from "../apiUrl.ts";

export const getCards = (): Promise<Card[]> => {
  return apiClient.get(API_ROUTES.cards);
};

export const getCardById = (id: number): Promise<Card> => {
  return apiClient.get(`${API_ROUTES.cards}/${id}`);
};

export const createCard = (cardListId: number, name: string, description: string): Promise<Card> => {
  return apiClient.post(API_ROUTES.cards, { cardListId, cardName: name, description });
};

export const updateCard = (id: number, name: string, description: string): Promise<Card> => {
  return apiClient.put(`${API_ROUTES.cards}/${id}`, { cardName: name, description });
};

export const deleteCard = (id: number): Promise<void> => {
  return apiClient.delete(`${API_ROUTES.cards}/${id}`);
};

export const moveCard = (id: number, prevCardId: number | null, nextCardId: number | null, cardListId: number): Promise<Card> => {
  return apiClient.patch(`${API_ROUTES.cards}/move/${id}`, { prevCardId, nextCardId, cardListId })
}
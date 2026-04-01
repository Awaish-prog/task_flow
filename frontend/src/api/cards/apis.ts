import type { Card } from "../../types/Types";
import apiClient from "../apiClient";


const cardUrl: string = '/cards';

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
  return apiClient.post(cardUrl, { cardListId, name, description });
};

export const updateCard = (
  id: number,
  name: string,
  description: string
): Promise<Card> => {
  return apiClient.put(`${cardUrl}/${id}`, { name, description });
};

export const deleteCard = (id: number): Promise<void> => {
  return apiClient.delete(`${cardUrl}/${id}`);
};
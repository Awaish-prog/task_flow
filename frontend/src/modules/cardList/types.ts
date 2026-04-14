import type { Card } from "../card/types";

export interface CardList {
  id: number;
  cardListName: string;
  boardId: number
}

export interface CardListData extends CardList {
  cards: Card[];
};
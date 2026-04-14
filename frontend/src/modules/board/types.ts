import type { CardListData } from "../cardList/types";

export interface Board {
  id: number;
  boardName: string;
}

export interface BoardData extends Board {
  cardLists: CardListData[];
};
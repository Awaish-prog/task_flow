export interface Card {
  id: number;
  name: string;
  description: string;
  cardListId: number
};

export interface CardList {
  id: number;
  name: string;
  boardId: number
}

export interface CardListData extends CardList {
  cards: Card[];
};

export interface Board {
  id: number;
  name: string;
}

export interface BoardData extends Board {
  cardLists: CardListData[];
};

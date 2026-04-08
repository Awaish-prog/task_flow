export interface Card {
  id: number;
  cardName: string;
  description: string;
  cardListId: number
  orderKey: string | null
};

export interface CardList {
  id: number;
  cardListName: string;
  boardId: number
}

export interface CardListData extends CardList {
  cards: Card[];
};

export interface Board {
  id: number;
  boardName: string;
}

export interface BoardData extends Board {
  cardLists: CardListData[];
};

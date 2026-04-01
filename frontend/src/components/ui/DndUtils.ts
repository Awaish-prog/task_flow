import { arrayMove } from "@dnd-kit/sortable";
import type { BoardData, Card, CardList, CardListData } from "../../types/Types";

interface DragCard {
  card: Card,
  listId: number
}

export const findCard = (board: BoardData, cardId: number): DragCard | null => {
  for (const list of board.cardLists) {
    const card = list.cards.find((card: Card) => card.id === cardId);
    if (card) return { card, listId: list.id };
  }
  return null;
};

export const moveCard = (board: BoardData, activeId: number, overId: number) => {
  const boardCopy: BoardData = structuredClone(board);

  const from: DragCard | null = findCard(boardCopy, activeId);
  const to: DragCard | null = findCard(boardCopy, overId);

  if (!from || !to) return board;

  const fromList: CardListData | undefined = boardCopy.cardLists.find(
    (cardList: CardList) => cardList.id === from.listId
  );

  const toList: CardListData | undefined = boardCopy.cardLists.find(
    (cardList: CardList) => cardList.id === to.listId
  );

  if (!fromList || !toList) return board;

  const fromIndex: number = fromList.cards.findIndex(
    (card: Card) => card.id === activeId
  );

  const toIndex: number = toList.cards.findIndex(
    (card: Card) => card.id === overId
  );

  if (from.listId === to.listId) {
    fromList.cards = arrayMove(fromList.cards, fromIndex, toIndex) as Card[];
  } else {
    const [moved] = fromList.cards.splice(fromIndex, 1) as Card[];
    toList.cards.splice(toIndex, 0, moved);
  }

  return boardCopy;
};

export const findListByCardId = (board: BoardData, cardId: number): CardListData | undefined => {
  return board.cardLists.find((list: CardListData) =>
    list.cards.some((card: Card) => card.id === cardId)
  );
};
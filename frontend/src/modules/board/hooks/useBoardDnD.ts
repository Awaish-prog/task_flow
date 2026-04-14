import type { DropResult } from "@hello-pangea/dnd";
import type { CardListData } from "../../../modules/cardList/types.ts";
import { useMoveCard } from "../../../api/cards/query.ts";

export const useBoardDnD = (boardId: number, cardLists: CardListData[]) => {
  const moveCard = useMoveCard();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceCardListId = Number(result.source.droppableId);
    const destinationListId = Number(result.destination.droppableId);
    const destinationIndex = result.destination.index;

    const destinationList = cardLists.find((l) => l.id === destinationListId);
    if (!destinationList) return;

    const prevCardId = destinationIndex > 0
      ? destinationList.cards[destinationIndex - 1]?.id
      : null;

    const nextCardId = destinationIndex < destinationList.cards.length
      ? destinationList.cards[destinationIndex]?.id
      : null;

    moveCard.mutate({
      cardId: Number(result.draggableId),
      cardListId: destinationListId,
      prevCardId,
      nextCardId,
      sourceCardListId,
      boardId,
      destCardIndex: destinationIndex,
    });
  };

  return { onDragEnd };
};

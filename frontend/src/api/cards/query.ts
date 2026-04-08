import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BoardData, Card, CardListData } from '../../types/Types'
import { QUERY_KEYS } from '../queryKeys'
import { createCard, deleteCard, moveCard, updateCard } from './apis'

export const useUpdateCard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, name, description, boardId}: { id: number, name: string, description: string, boardId: number
    }) => await updateCard(id, name, description),

    onSuccess: (updatedCard: Card, variables) => {
      const { boardId } = variables

      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, boardId],
        (board: BoardData) => {
          if (!board) return board

          return {
            ...board,
            cardLists: board.cardLists.map((cardList: any) => {
              if (cardList.id !== updatedCard.cardListId) {
                return cardList
              }

              return {
                ...cardList,
                cards: cardList.cards.map((card: any) =>
                  card.id === updatedCard.id
                    ? updatedCard
                    : card
                ),
              }
            }),
          }
        }
      )
    },

  })
}

export const useMoveCard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      cardId,
      prevCardId,
      nextCardId,
      cardListId,
      sourceCardListId,
      boardId,
      destCardIndex
    }: {
      cardId: number
      prevCardId: number | null
      nextCardId: number | null
      cardListId: number
      sourceCardListId: number
      boardId: number,
      destCardIndex: number
    }) => {
      return moveCard(cardId, prevCardId, nextCardId, cardListId)
    },

    onMutate: async (variables) => {
      const {
        boardId,
        cardId,
        cardListId,
        sourceCardListId,
        prevCardId,
        nextCardId,
        destCardIndex
      } = variables

      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.BOARD, boardId],
      })

      const previousBoard = queryClient.getQueryData<BoardData>([
        QUERY_KEYS.BOARD,
        boardId,
      ])

      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, boardId],
        (board: BoardData | undefined) => {
          if (!board) return board

          const destCardListIndex: number = board.cardLists.findIndex(cardList => cardList.id === cardListId);          
          const sourceCardListIndex: number = board.cardLists.findIndex(cardList => cardList.id === sourceCardListId);

          if (sourceCardListIndex === -1 || destCardListIndex === -1) {
            return;
          }

          const sourceCardList: CardListData = { ...board.cardLists[sourceCardListIndex] };
          const destCardList: CardListData = { ...board.cardLists[destCardListIndex] };

          const cardIndex = sourceCardList.cards.findIndex(card => card.id === cardId);
          const card: Card | undefined = cardIndex !== -1 ? sourceCardList.cards.splice(cardIndex, 1)[0] : undefined;

          if (!card) {
            return;
          }

          destCardList.cards.splice(destCardIndex, 0, card);

          board.cardLists[sourceCardListIndex] = sourceCardList;
          board.cardLists[destCardListIndex] = destCardList

          return board;
        }
      )

      return { previousBoard }
    },

    onError: (_err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(
          [QUERY_KEYS.BOARD, variables.boardId],
          context.previousBoard
        )
      }
    },

    onSettled: (_data, _error, variables) => {
      // queryClient.invalidateQueries({
      //   queryKey: [ QUERY_KEYS.BOARD, variables.boardId,]
      // })
    },
  })
}

type CreateCardPayload = {
  name: string;
  description: string;
  cardListId: number;
  boardId: number;
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCardPayload) => await createCard(data.cardListId, data.name, data.description),

    onSuccess: (newCard, variables) => {
      queryClient.setQueryData<BoardData>(
        [QUERY_KEYS.BOARD, variables.boardId],
        (board: BoardData | undefined) => {
          if (!board) return board;

          return {
            ...board,
            cardLists: board.cardLists.map((cardList) => {
              if (cardList.id !== variables.cardListId) return cardList;

              return {
                ...cardList,
                cards: [...cardList.cards, newCard],
              };
            }),
          };
        }
      );
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async ({
      cardId,
      cardListId,
      boardId
    } : { cardId: number, cardListId: number, boardId: number }) => {
      return await deleteCard(cardId);
    },

    onMutate: async (variables: { cardId: number, cardListId: number, boardId: number }) => {

      const { cardListId, boardId, cardId } = variables
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.BOARD, boardId],
      });

      const previousBoard: BoardData | undefined = queryClient.getQueryData([
        QUERY_KEYS.BOARD,
        boardId,
      ]);

      if (!previousBoard) {
        return;
      }
      queryClient.setQueryData(
  [QUERY_KEYS.BOARD, boardId],
  (oldData: BoardData | undefined) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      cardLists: oldData.cardLists.map((cardList) => {

        if (cardList.id !== cardListId) return cardList;

        return {
          ...cardList,
          cards: cardList.cards.filter(
            (card) => card.id !== cardId
          ),
        };
      }),
    };
  }
);
      return { previousBoard };
    },

    onError: (_err, boardId, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, boardId],
        context?.previousBoard
      );
    },

    onSettled: (_data, _err, boardId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BOARD, boardId]
      });
    },

  });
}
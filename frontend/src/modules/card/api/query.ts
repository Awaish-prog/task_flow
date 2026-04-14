import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BoardData } from "../../board/types.ts"
import type { Card } from '../types.ts'
import { QUERY_KEYS } from '../../../api/queryKeys.ts'
import { createCard, deleteCard, moveCard, updateCard } from './apis'
import type { CardListData } from '../../cardList/types.ts'

export const useUpdateCard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, name, description, boardId}: { id: number, name: string, description: string, boardId: number}) => await updateCard(id, name, description),

    onSuccess: (updatedCard: Card, variables) => {
      const { boardId } = variables

      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, boardId],
        (board: BoardData) => {
          if (!board) return board

          return {
            ...board,
            cardLists: board.cardLists.map((cardList: CardListData) => {
              if (cardList.id !== updatedCard.cardListId) {
                return cardList
              }

              return {
                ...cardList,
                cards: cardList.cards.map((card: Card) =>
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

      const initialBoard = structuredClone(previousBoard)

      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, boardId],
        (board: BoardData | undefined) => {
          if (!board) return board

          const newBoard = structuredClone(board)

          const destIndex = newBoard.cardLists.findIndex(cardList => cardList.id === cardListId)
          const sourceIndex = newBoard.cardLists.findIndex(cardList => cardList.id === sourceCardListId)

          if (destIndex === -1 || sourceIndex === -1) return board

          const sourceList = newBoard.cardLists[sourceIndex]
          const destList = newBoard.cardLists[destIndex]

          const cardIndex = sourceList.cards.findIndex(card => card.id === cardId)
          
          if (cardIndex === -1) return board

          const [card] = sourceList.cards.splice(cardIndex, 1)
          destList.cards.splice(destCardIndex, 0, card)

          return newBoard
        }
      )

      return { initialBoard }
    },

    onError: (_err, variables, context) => {
      if (context?.initialBoard) {
        queryClient.setQueryData(
          [QUERY_KEYS.BOARD, variables.boardId],
          context.initialBoard
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

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      cardListId: number;
      boardId: number;
    }) => await createCard(data.cardListId, data.name, data.description),

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
      boardId
    } : { cardId: number, boardId: number }) => {
      return await deleteCard(cardId);
    },


    onSuccess: (_, variables: { cardId: number, boardId: number }) => {

      const { boardId, cardId } = variables

      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, boardId],
        (board: BoardData | undefined) => {
          if (!board) return board;

          return {
            ...board,
            cardLists: board.cardLists.map((cardList) => {

            return {
              ...cardList,
              cards: cardList.cards.filter(
                (card) => card.id !== cardId
              )};
            }),
          };
        }
      );
    }
  });
}
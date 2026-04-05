import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BoardData, Card } from '../../types/Types'
import { QUERY_KEYS } from '../queryKeys'
import { createCard, moveCard, updateCard } from './apis'

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
      cardListId,        // target list
      sourceCardListId,  // 🆕 source list
      boardId,
    }: {
      cardId: number
      prevCardId: number | null
      nextCardId: number | null
      cardListId: number
      sourceCardListId: number
      boardId: number
    }) => {
      return moveCard(cardId, prevCardId, nextCardId, cardListId)
    },

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (variables) => {
      const {
        boardId,
        cardId,
        cardListId,
        sourceCardListId,
        prevCardId,
        nextCardId,
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

          let movingCard: any = null

          return {
            ...board,
            cardLists: board.cardLists.map((list: any) => {
              // 🟡 SOURCE LIST → remove card
              if (list.id === sourceCardListId) {
                const filtered = list.cards.filter((card: any) => {
                  if (card.id === cardId) {
                    movingCard = card
                    return false
                  }
                  return true
                })

                return {
                  ...list,
                  cards: filtered,
                }
              }

              // 🟢 TARGET LIST → insert card
              if (list.id === cardListId) {
                const newCards = [...list.cards]

                // If same list, movingCard might still be null at this point
                if (!movingCard && sourceCardListId === cardListId) {
                  const existing = list.cards.find(
                    (c: any) => c.id === cardId
                  )
                  movingCard = existing
                }

                if (!movingCard) return list

                let insertIndex = 0

                if (prevCardId) {
                  insertIndex =
                    newCards.findIndex((c) => c.id === prevCardId) + 1
                } else if (nextCardId) {
                  insertIndex = newCards.findIndex(
                    (c) => c.id === nextCardId
                  )
                }

                newCards.splice(insertIndex, 0, {
                  ...movingCard,
                  cardListId,
                })

                return {
                  ...list,
                  cards: newCards,
                }
              }

              return list
            }),
          }
        }
      )

      return { previousBoard }
    },

    // ❌ Rollback
    onError: (_err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(
          [QUERY_KEYS.BOARD, variables.boardId],
          context.previousBoard
        )
      }
    },

    // 🔄 Refetch for correctness
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ QUERY_KEYS.BOARD, variables.boardId,]
      })
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
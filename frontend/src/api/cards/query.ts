import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BoardData, Card } from '../../types/Types'
import { QUERY_KEYS } from '../queryKeys'
import { createCard, updateCard } from './apis'

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
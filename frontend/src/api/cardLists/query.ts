import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCardList, updateCardList } from './apis'
import type { BoardData, CardList, CardListData } from '../../types/Types'
import { QUERY_KEYS } from '../queryKeys'


export const useUpdateCardList = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, name}: { id: number, name: string }) => await updateCardList(id, name),

    onSuccess: (updatedCardList: CardList) => {

      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, updatedCardList.boardId],
        (board: BoardData) => {
          if (!board) return board

          return {
            ...board,
            cardLists: board.cardLists.map((cardList: any) =>
              cardList.id === updatedCardList.id
                ? updatedCardList
                : cardList
            ),
          }
        }
      )
    },
  })
}

export const useCreateCardList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, name }: { boardId: number; name: string; }) => await createCardList(boardId, name),

    onSuccess: (newCardList: CardListData) => {
      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, newCardList.boardId],
        (board: BoardData) => {
          if (!board) return board;

          newCardList.cards = []

          return {
            ...board,
            cardLists: [...board.cardLists, newCardList],
          };
        }
      );
    },
  });
};
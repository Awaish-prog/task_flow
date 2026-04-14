import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCardList, deleteCardList, updateCardList } from './apis'
import type { CardList, CardListData } from '../../modules/cardList/types.ts'
import type { BoardData } from '../../modules/board/types.ts'
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

export const useDeleteCardList = () => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async ({
      cardListId,
      boardId
    } : { cardListId: number, boardId: number }) => {
      return await deleteCardList(cardListId);
    },

    onSuccess: (_, variables: { cardListId: number, boardId: number }) => {

      const { cardListId, boardId } = variables

      queryClient.setQueryData(
    [QUERY_KEYS.BOARD, boardId],
    (oldData: BoardData | undefined) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        cardLists: oldData.cardLists.filter(
          (cardList) => cardList.id !== cardListId
        ),
      };
    }
  );
    }

  });
}
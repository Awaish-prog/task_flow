import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBoard, deleteBoard, getBoardById, getBoards, updateBoard } from './apis'
import { QUERY_KEYS } from '../queryKeys'
import type { Board } from '../../types/Types'
import { BOARD_ID_KEY } from '../../App'

export const useBoard = (boardId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOARD, boardId],
    queryFn: async () => await getBoardById(boardId),
  })
}

export const useUpdateBoard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => await updateBoard(id, name),
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, updatedBoard.id],
        updatedBoard
      )
    },
  })
}

export const useBoards = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOARDS],
    queryFn: getBoards,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,

    onSuccess: (newBoard) => {

      queryClient.setQueryData([QUERY_KEYS.BOARDS], (boards: Board[] = []) => [
        ...boards,
        newBoard,
      ]);
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: deleteBoard,

    onMutate: async (boardId: number) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.BOARD, boardId],
      });

      const previousBoard = queryClient.getQueryData([
        QUERY_KEYS.BOARD,
        boardId,
      ]);

      console.log(`sending data: ${previousBoard}`)

      return { previousBoard };
    },

    onSuccess: () => {
      localStorage.removeItem(BOARD_ID_KEY);
    },

    onError: (_err, boardId, context) => {
      console.log(`running on error: ${context?.previousBoard}`)
      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, boardId],
        context?.previousBoard
      );
    },

    onSettled: (_data, _err, boardId) => {
      console.log(`Running settled`)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BOARDS],
      });
    },

  });
}
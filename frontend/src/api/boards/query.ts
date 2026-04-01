import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBoard, getBoardById, getBoards, updateBoard } from './apis'
import { QUERY_KEYS } from '../queryKeys'
import type { Board } from '../../types/Types'

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
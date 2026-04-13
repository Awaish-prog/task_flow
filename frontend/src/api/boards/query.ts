import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBoard, deleteBoard, getBoardById, getBoards, updateBoard } from './apis'
import { QUERY_KEYS } from '../queryKeys'
import type { Board, BoardData } from '../../types/Types'
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
      (oldData: BoardData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          boardName: updatedBoard.boardName,
        }
      }
    )
      queryClient.setQueryData(
        [QUERY_KEYS.BOARDS],
        (boards: Board[]) => {

          if (!boards || !boards.length) return boards;

          return boards.map((board) =>
            board.id === updatedBoard.id
            ? { ...board, boardName: updatedBoard.boardName }
            : board
          );

        }
      )
  }
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

    onSuccess: (_data, boardId) => {
      localStorage.removeItem(BOARD_ID_KEY);
      queryClient.setQueryData([QUERY_KEYS.BOARDS], (boards: Board[]) => {
        return boards?.filter(board => board.id !== boardId);
      });
    }

  });
}
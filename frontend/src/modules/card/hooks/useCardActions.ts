import { useUpdateCard, useDeleteCard } from "../api/query.ts";

export const useCardActions = (boardId: number, cardId: number, initialName: string, initialDescription: string) => {
  const update = useUpdateCard();
  const del = useDeleteCard();

  const updateName = (name: string) => {

    update.mutate(
      {
        id: cardId,
        name,
        boardId,
        description: initialDescription,
      }
    );
  };

  const updateDescription = (description: string) => {

    update.mutate(
      {
        id: cardId,
        description,
        boardId,
        name: initialName,
      }
    );
  };

  const remove = async () => {
    await del.mutateAsync({ boardId, cardId });
  };

  return { updateName, updateDescription, remove };
};
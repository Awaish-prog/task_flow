
import { useState } from "react";
import { useCreateCard } from "../../../api/cards/query.ts";

export const useCreateCardHandler = (boardId: number, cardListId: number) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const mutation = useCreateCard();

  const create = async () => {

    await mutation.mutateAsync({
        name,
        description,
        cardListId,
        boardId,
    });

    setName("");
    setDescription("");
    setIsAdding(false);
  };

  return {
    isAdding,
    setIsAdding,
    name,
    setName,
    description,
    setDescription,
    create,
    isPending: mutation.isPending,
  };
};
import { useState } from "react";
import { useCreateCardList } from "../../cardList/api/query.ts";

export const useCreateList = (boardId: number) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const mutation = useCreateCardList();

  const create = async () => {

    await mutation.mutateAsync({ boardId, name });
    setName("");
    setIsAdding(false);
  };

  return { isAdding, setIsAdding, name, setName, create, isPending: mutation.isPending };
};
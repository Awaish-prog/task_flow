import { DragDropContext } from "@hello-pangea/dnd";
import { useBoard } from "../../api/boards/query";
import BoardLoader from "./BoardLoader";
import { BoardHeader } from "./components/BoardHeader.tsx";
import { AddListCard } from "./components/AddListCard.tsx";
import { useBoardDnD } from "./hooks/useBoardDnD.ts";
import CardList from "../cardList/CardList.tsx";

export default function Board({ boardId, handleBoardDelete }: { boardId: number; handleBoardDelete: (id: number) => void; }) {
  const { data: board, isLoading } = useBoard(boardId);

  const { onDragEnd } = useBoardDnD(
    boardId,
    board?.cardLists ?? []
  );

  if (isLoading || !board) return <BoardLoader />;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-4">
        <BoardHeader id={board.id} name={board.boardName} onDeleted={handleBoardDelete} />

        <div className="flex gap-3 overflow-x-auto pb-4">
            {board.cardLists.map((cardList) => (
            <CardList
              key={cardList.id}
              id={cardList.id}
              boardId={boardId}
              cardList={cardList}
            />
          ))}

          <AddListCard boardId={boardId} />
        </div>
      </div>
    </DragDropContext>
  );
}
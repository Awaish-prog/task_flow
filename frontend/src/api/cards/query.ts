import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BoardData, Card } from '../../types/Types'
import { QUERY_KEYS } from '../queryKeys'
import { createCard, moveCard, updateCard } from './apis'

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

export const useMoveCard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      cardId,
      prevCardId,
      nextCardId,
      cardListId,
      sourceCardListId,
      boardId,
    }: {
      cardId: number
      prevCardId: number | null
      nextCardId: number | null
      cardListId: number
      sourceCardListId: number
      boardId: number
    }) => {
      return moveCard(cardId, prevCardId, nextCardId, cardListId)
    },

    onMutate: async (variables) => {
      const {
        boardId,
        cardId,
        cardListId,
        sourceCardListId,
        prevCardId,
        nextCardId,
      } = variables

      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.BOARD, boardId],
      })

      const previousBoard = queryClient.getQueryData<BoardData>([
        QUERY_KEYS.BOARD,
        boardId,
      ])

      queryClient.setQueryData(
        [QUERY_KEYS.BOARD, boardId],
        (board: BoardData | undefined) => {
          if (!board) return board

          // let movingCard: any = null
          console.log("Begin")

          const sourceCardList: Card[] = [...board.cardLists[sourceCardListId].cards]

          const { unMovedCards, movedCard } = sourceCardList.reduce<{unMovedCards: Card[]; movedCard: Card[];}>(
                          (acc, card) => {
                            if (card.id === cardId) {
                              acc.movedCard.push(card);
                            } else {
                              acc.unMovedCards.push(card);
                            }
                            return acc;
                          },
                          { unMovedCards: [], movedCard: [] }
                        );

          console.log("got the card")
          board.cardLists[sourceCardListId].cards = unMovedCards

          const destinationCardList: Card[] = [...board.cardLists[cardListId].cards]

          if (!destinationCardList.length) {
            destinationCardList.push(movedCard[0])
            board.cardLists[cardListId].cards = destinationCardList
            return board;
          }

          const prevCardIndex: number = destinationCardList.findIndex((card: Card) => card.id === prevCardId)
          const nextCardIndex: number = destinationCardList.findIndex((card: Card) => card.id === nextCardId)

          const cardIndexInNewList: number = prevCardIndex !== -1 ? prevCardIndex + 1 :
                        nextCardIndex !== -1 ? nextCardIndex :
                        -1;
          if (cardIndexInNewList !== -1) {
          
            board.cardLists[cardListId].cards = [
              ...destinationCardList.slice(0, cardIndexInNewList),
              movedCard[0],
              ...destinationCardList.slice(cardIndexInNewList)
            ];
          } else {
            destinationCardList.push(movedCard[0])
          }

          board.cardLists[cardListId].cards = destinationCardList

          console.log(`final list: ${board}`)
          return board;

          // return {
          //   ...board,
          //   cardLists: board.cardLists.map((list: any) => {
  
          //     if (list.id === sourceCardListId) {
          //       const filtered = list.cards.filter((card: any) => {
          //         if (card.id === cardId) {
          //           movingCard = card
          //           return false
          //         }
          //         return true
          //       })

          //       return {
          //         ...list,
          //         cards: filtered,
          //       }
          //     }

          //     if (list.id === cardListId) {
          //       const newCards = [...list.cards]

          //       if (!movingCard && sourceCardListId === cardListId) {
          //         const existing = list.cards.find(
          //           (c: any) => c.id === cardId
          //         )
          //         movingCard = existing
          //       }
          //       console.log(`Card is: ${movingCard}`)
          //       if (!movingCard) return list

          //       let insertIndex = 0

          //       if (prevCardId) {
          //         insertIndex =
          //           newCards.findIndex((c) => c.id === prevCardId) + 1
          //       } else if (nextCardId) {
          //         insertIndex = newCards.findIndex(
          //           (c) => c.id === nextCardId
          //         )
          //       }

          //       newCards.splice(insertIndex, 0, {
          //         ...movingCard,
          //         cardListId,
          //       })

          //       return {
          //         ...list,
          //         cards: newCards,
          //       }
          //     }

          //     return list
          //   }),
          // }
        }
      )

      return { previousBoard }
    },

    onError: (_err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(
          [QUERY_KEYS.BOARD, variables.boardId],
          context.previousBoard
        )
      }
    },

    onSettled: (_data, _error, variables) => {
      // queryClient.invalidateQueries({
      //   queryKey: [ QUERY_KEYS.BOARD, variables.boardId,]
      // })
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
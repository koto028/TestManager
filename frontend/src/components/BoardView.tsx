import { useState, useEffect } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { Board, TaskList } from '../api/boardApi'
import { boardApi } from '../api/boardApi'
import { ListColumn } from './ListColumn'

interface Props {
  board: Board
}

export function BoardView({ board }: Props) {
  const [lists, setLists] = useState<TaskList[]>(board.lists)

  useEffect(() => {
    setLists(board.lists)
  }, [board])

  function handleDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    const sourceListId = Number(source.droppableId)
    const destListId = Number(destination.droppableId)
    const cardId = Number(draggableId)

    // 楽観的UI更新
    const newLists = lists.map((l) => ({ ...l, cards: [...l.cards] }))
    const srcList = newLists.find((l) => l.id === sourceListId)!
    const dstList = newLists.find((l) => l.id === destListId)!

    const [movedCard] = srcList.cards.splice(source.index, 1)
    dstList.cards.splice(destination.index, 0, movedCard)
    setLists(newLists)

    // APIへ反映
    const calls = [boardApi.reorderCards(destListId, dstList.cards.map((c) => c.id))]
    if (sourceListId !== destListId) {
      calls.push(boardApi.reorderCards(sourceListId, srcList.cards.map((c) => c.id)))
    }
    Promise.all(calls).catch(() => {
      // エラー時は元の状態に戻す
      setLists(board.lists)
    })

    void cardId
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{board.title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {lists.map((list) => (
            <ListColumn key={list.id} list={list} boardId={board.id} />
          ))}
          {lists.length === 0 && (
            <p className="text-gray-400">リストがありません</p>
          )}
        </div>
      </div>
    </DragDropContext>
  )
}

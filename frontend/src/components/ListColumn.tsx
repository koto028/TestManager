import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Card, TaskList } from '../api/boardApi'
import { boardApi } from '../api/boardApi'
import { CardItem } from './CardItem'
import { AddCardForm } from './AddCardForm'

const PRIORITY_LABELS = ['優先度', '低', '中', '高'] as const
const PRIORITY_STYLES = [
  'text-gray-400 border border-dashed border-gray-300 hover:border-gray-400',
  'bg-green-100 text-green-700 hover:bg-green-200',
  'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  'bg-red-100 text-red-600 hover:bg-red-200',
] as const

type SortMode = 'default' | 'due-asc'

function sortCards(cards: Card[], mode: SortMode): Card[] {
  if (mode === 'default') return cards
  return [...cards].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1   // 期日なしは末尾
    if (!b.dueDate) return -1
    return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0
  })
}

interface Props {
  list: TaskList
  boardId: number
}

export function ListColumn({ list, boardId }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const queryClient = useQueryClient()

  const priorityMutation = useMutation({
    mutationFn: (next: number) => boardApi.updateListPriority(list.id, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
    },
  })

  function handleCyclePriority() {
    const next = (list.priority + 1) % 4
    priorityMutation.mutate(next)
  }

  function toggleSort() {
    setSortMode(prev => prev === 'default' ? 'due-asc' : 'default')
  }

  const displayCards = sortCards(list.cards, sortMode)
  const isSorting = sortMode !== 'default'

  return (
    <div className="flex-shrink-0 w-64 bg-gray-100 rounded-xl p-3 flex flex-col gap-2">
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-gray-700 text-sm">{list.title}</h3>
        <div className="flex items-center gap-1">
          {/* 期限順ソートボタン */}
          <button
            onClick={toggleSort}
            title={isSorting ? '標準順に戻す' : '期限順に並び替え'}
            className={`rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
              isSorting
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'
            }`}
          >
            {isSorting ? '期限順 ↑' : '期限順'}
          </button>
          {/* 優先度バッジ */}
          <button
            onClick={handleCyclePriority}
            disabled={priorityMutation.isPending}
            className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${PRIORITY_STYLES[list.priority]}`}
            title="クリックで優先度を変更"
          >
            {PRIORITY_LABELS[list.priority]}
          </button>
        </div>
      </div>

      <Droppable droppableId={String(list.id)} isDropDisabled={isSorting}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 min-h-8 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {displayCards.map((card, index) => (
              <CardItem key={card.id} card={card} boardId={boardId} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {list.cards.length === 0 && (
        <p className="text-xs text-gray-400 px-1">カードがありません</p>
      )}
      <AddCardForm listId={list.id} boardId={boardId} />
    </div>
  )
}

import { Droppable } from '@hello-pangea/dnd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TaskList } from '../api/boardApi'
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

interface Props {
  list: TaskList
  boardId: number
}

export function ListColumn({ list, boardId }: Props) {
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

  return (
    <div className="flex-shrink-0 w-64 bg-gray-100 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-gray-700 text-sm">{list.title}</h3>
        <button
          onClick={handleCyclePriority}
          disabled={priorityMutation.isPending}
          className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${PRIORITY_STYLES[list.priority]}`}
          title="クリックで優先度を変更"
        >
          {PRIORITY_LABELS[list.priority]}
        </button>
      </div>

      <Droppable droppableId={String(list.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 min-h-8 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {list.cards.map((card, index) => (
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

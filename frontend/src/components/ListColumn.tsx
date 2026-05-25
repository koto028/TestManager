import { Droppable } from '@hello-pangea/dnd'
import type { TaskList } from '../api/boardApi'
import { CardItem } from './CardItem'
import { AddCardForm } from './AddCardForm'

interface Props {
  list: TaskList
  boardId: number
}

export function ListColumn({ list, boardId }: Props) {
  return (
    <div className="flex-shrink-0 w-64 bg-gray-100 rounded-xl p-3 flex flex-col gap-2">
      <h3 className="font-semibold text-gray-700 text-sm px-1">{list.title}</h3>
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

import type { TaskList } from '../api/boardApi'
import { CardItem } from './CardItem'

interface Props {
  list: TaskList
  boardId: number
}

export function ListColumn({ list, boardId }: Props) {
  return (
    <div className="flex-shrink-0 w-64 bg-gray-100 rounded-xl p-3 flex flex-col gap-2">
      <h3 className="font-semibold text-gray-700 text-sm px-1">{list.title}</h3>
      <div className="flex flex-col gap-2">
        {list.cards.map((card) => (
          <CardItem key={card.id} card={card} boardId={boardId} />
        ))}
      </div>
      {list.cards.length === 0 && (
        <p className="text-xs text-gray-400 px-1">カードがありません</p>
      )}
    </div>
  )
}

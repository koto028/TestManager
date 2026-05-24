import type { Board } from '../api/boardApi'
import { ListColumn } from './ListColumn'

interface Props {
  board: Board
}

export function BoardView({ board }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{board.title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.lists.map((list) => (
          <ListColumn key={list.id} list={list} boardId={board.id} />
        ))}
        {board.lists.length === 0 && (
          <p className="text-gray-400">リストがありません</p>
        )}
      </div>
    </div>
  )
}

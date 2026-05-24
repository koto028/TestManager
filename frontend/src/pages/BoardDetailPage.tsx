import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { boardApi } from '../api/boardApi'
import { BoardView } from '../components/BoardView'

export function BoardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const boardId = Number(id)

  const { data: board, isLoading, isError } = useQuery({
    queryKey: ['boards', boardId],
    queryFn: () => boardApi.get(boardId),
    enabled: !isNaN(boardId),
  })

  if (isLoading) return <div className="text-gray-500 p-8">読み込み中...</div>
  if (isError) return <div className="text-red-500 p-8">ボードが見つかりません</div>

  return (
    <div className="p-8">
      <Link to="/" className="text-blue-500 hover:underline text-sm mb-6 inline-block">
        ← ボード一覧に戻る
      </Link>
      {board && <BoardView board={board} />}
    </div>
  )
}

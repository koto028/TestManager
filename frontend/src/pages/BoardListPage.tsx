import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { boardApi } from '../api/boardApi'

export function BoardListPage() {
  const { data: boards, isLoading, isError } = useQuery({
    queryKey: ['boards'],
    queryFn: boardApi.list,
  })

  if (isLoading) return <div className="text-gray-500 p-8">読み込み中...</div>
  if (isError) return <div className="text-red-500 p-8">データの取得に失敗しました</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ボード一覧</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards?.map((board) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className="block bg-blue-500 hover:bg-blue-600 rounded-xl p-6 text-white font-semibold text-lg shadow transition-colors"
          >
            {board.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

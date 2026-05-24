import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardApi } from '../api/boardApi'

interface Props {
  listId: number
  boardId: number
}

export function AddCardForm({ listId, boardId }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const mutation = useMutation({
    mutationFn: () => boardApi.createCard(listId, title.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
      setTitle('')
      setOpen(false)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    mutation.mutate()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (title.trim()) mutation.mutate()
    }
    if (e.key === 'Escape') {
      setTitle('')
      setOpen(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg px-2 py-1.5 transition-colors"
      >
        + カードを追加
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="カードのタイトルを入力..."
        rows={2}
        className="w-full resize-none rounded-lg border border-blue-400 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {mutation.isError && (
        <p className="text-xs text-red-500">送信に失敗しました。再試行してください。</p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim() || mutation.isPending}
          className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {mutation.isPending ? '追加中...' : 'カードを追加'}
        </button>
        <button
          type="button"
          onClick={() => { setTitle(''); setOpen(false) }}
          className="text-gray-500 hover:text-gray-700 text-lg leading-none"
        >
          ✕
        </button>
      </div>
    </form>
  )
}

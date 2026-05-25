import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Card } from '../api/boardApi'
import { boardApi } from '../api/boardApi'

const PRIORITY_LABELS = ['', '低', '中', '高'] as const
const PRIORITY_COLORS = [
  '',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
] as const

interface Props {
  card: Card
  boardId: number
  index: number
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

function isOverdue(iso: string): boolean {
  return new Date(iso) < new Date(new Date().toDateString())
}

export function CardItem({ card, boardId, index }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [priority, setPriority] = useState(card.priority)
  const [dueDate, setDueDate] = useState(card.dueDate ?? '')
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: () =>
      boardApi.updateCard(card.id, {
        title: title.trim(),
        priority,
        dueDate: dueDate || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
      setEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => boardApi.deleteCard(card.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] })
    },
  })

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (window.confirm(`「${card.title}」を削除しますか？`)) {
      deleteMutation.mutate()
    }
  }

  function handleSave() {
    if (!title.trim()) return
    updateMutation.mutate()
  }

  function handleCancel() {
    setTitle(card.title)
    setPriority(card.priority)
    setDueDate(card.dueDate ?? '')
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') handleCancel()
  }

  return (
    <Draggable draggableId={String(card.id)} index={index} isDragDisabled={editing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {editing ? (
            <div className="bg-white rounded-lg border border-blue-400 shadow-sm px-3 py-2 flex flex-col gap-2">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                autoFocus
                className="w-full resize-none text-sm text-gray-800 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="flex gap-2">
                <div className="flex flex-col gap-0.5 flex-1">
                  <label className="text-xs text-gray-500">優先度</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="text-sm border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value={0}>なし</option>
                    <option value={1}>低</option>
                    <option value={2}>中</option>
                    <option value={3}>高</option>
                  </select>
                </div>

                <div className="flex flex-col gap-0.5 flex-1">
                  <label className="text-xs text-gray-500">期日</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="text-sm border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {updateMutation.isError && (
                <p className="text-xs text-red-500">保存に失敗しました。再試行してください。</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!title.trim() || updateMutation.isPending}
                  className="flex-1 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {updateMutation.isPending ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditing(true)}
              className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2 text-sm text-gray-800 hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing ${
                snapshot.isDragging ? 'shadow-lg rotate-1 opacity-90' : ''
              }`}
            >
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all disabled:opacity-50"
                title="削除"
              >
                ✕
              </button>
              <div className="flex items-start justify-between gap-1 pr-5">
                <span className="flex-1 leading-snug">{card.title}</span>
                {card.priority > 0 && (
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[card.priority]}`}>
                    {PRIORITY_LABELS[card.priority]}
                  </span>
                )}
              </div>
              {card.dueDate && (
                <p className={`mt-1 text-xs ${isOverdue(card.dueDate) ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                  {isOverdue(card.dueDate) ? '⚠ ' : ''}期日: {formatDate(card.dueDate)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

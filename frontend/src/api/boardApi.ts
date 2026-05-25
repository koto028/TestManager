export interface Card {
  id: number
  title: string
  sortOrder: number
  priority: number
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface CardUpdatePayload {
  title: string
  priority: number
  dueDate: string | null
}

export interface TaskList {
  id: number
  title: string
  sortOrder: number
  priority: number
  cards: Card[]
  createdAt: string
  updatedAt: string
}

export interface Board {
  id: number
  title: string
  lists: TaskList[]
  createdAt: string
  updatedAt: string
}

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }
  return res.json() as Promise<T>
}

export const boardApi = {
  list: () => request<Board[]>('/boards'),
  get: (id: number) => request<Board>(`/boards/${id}`),
  createCard: (listId: number, title: string) =>
    request<Card>(`/lists/${listId}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }),
  updateCard: (cardId: number, payload: CardUpdatePayload) =>
    request<Card>(`/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  reorderCards: (listId: number, cardIds: number[]) =>
    request<void>(`/lists/${listId}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardIds }),
    }),
  deleteCard: (cardId: number) =>
    request<void>(`/cards/${cardId}`, { method: 'DELETE' }),
  updateListPriority: (listId: number, priority: number) =>
    request<TaskList>(`/lists/${listId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority }),
    }),
}

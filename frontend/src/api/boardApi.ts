export interface Card {
  id: number
  title: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TaskList {
  id: number
  title: string
  sortOrder: number
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
}

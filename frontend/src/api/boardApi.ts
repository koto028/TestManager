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

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export const boardApi = {
  list: () => request<Board[]>('/boards'),
  get: (id: number) => request<Board>(`/boards/${id}`),
}

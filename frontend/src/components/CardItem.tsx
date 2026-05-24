import type { Card } from '../api/boardApi'

interface Props {
  card: Card
}

export function CardItem({ card }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2 text-sm text-gray-800 hover:shadow-md transition-shadow cursor-pointer">
      {card.title}
    </div>
  )
}

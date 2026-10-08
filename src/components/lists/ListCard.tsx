import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { PlaceListSummary } from '@/types'

export function ListCard({ list }: { list: PlaceListSummary }) {
  return (
    <article className="relative flex items-center justify-between gap-3 rounded-xl bg-surface p-4 shadow-soft transition-shadow hover:shadow-lift">
      <div className="min-w-0">
        <h3 className="text-h3 leading-snug">
          <Link
            to={`/lists/${list.id}`}
            className="after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-offset-[-2px]"
          >
            {list.name}
          </Link>
        </h3>
        {list.description && <p className="mt-1 text-body text-ink-soft">{list.description}</p>}
        <p className="mt-2 text-small text-ink-muted">
          {list.place_count} {list.place_count === 1 ? 'place' : 'places'}
        </p>
      </div>
      <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-ink-muted" />
    </article>
  )
}

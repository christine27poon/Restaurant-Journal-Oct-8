import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Chip } from '@/components/ui/Chip'
import { placeLocation, priceLabel } from '@/lib/format'
import type { Place } from '@/types'

interface PlaceCardProps {
  place: Place
  note?: string | null
  /** Buttons etc. rendered under the details; they stay above the card's link overlay. */
  actions?: ReactNode
}

export function PlaceCard({ place, note, actions }: PlaceCardProps) {
  const price = priceLabel(place.price_tier)
  return (
    <article className="relative rounded-xl bg-surface p-4 shadow-soft">
      <h3 className="text-h3 leading-snug">
        <Link
          to={`/places/${place.id}`}
          className="after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-offset-[-2px]"
        >
          {place.name}
        </Link>
      </h3>
      <p className="text-small text-ink-muted">{placeLocation(place)}</p>
      {(place.cuisine || price) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {place.cuisine && <Chip>{place.cuisine}</Chip>}
          {price && (
            <Chip>
              <span className="sr-only">Price: </span>
              {price}
            </Chip>
          )}
        </div>
      )}
      {note && <p className="mt-3 text-body text-ink-soft">{note}</p>}
      {actions && <div className="relative z-10 mt-4 flex flex-wrap gap-2">{actions}</div>}
    </article>
  )
}

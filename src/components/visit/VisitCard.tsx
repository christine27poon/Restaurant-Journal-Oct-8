import { Link } from 'react-router-dom'
import { ImageOff, Undo2 } from 'lucide-react'
import { Chip } from '@/components/ui/Chip'
import { FEELING_LABEL, HEALTH_TAG_LABEL, RATING_LABEL } from '@/lib/constants'
import { formatVisitDate, photoAlt, placeLocation, priceLabel, ratingTone } from '@/lib/format'
import type { VisitWithPlace } from '@/types'

interface VisitCardProps {
  visit: VisitWithPlace
  showHealthTags?: boolean
  /** Hide the place name/link when the card already sits on that place's page. */
  hidePlace?: boolean
}

export function VisitCard({ visit, showHealthTags = true, hidePlace = false }: VisitCardProps) {
  const { place } = visit
  const title = visit.dish_name ?? (hidePlace ? 'A visit' : place.name)
  const price = priceLabel(visit.price_tier)

  return (
    <article className="group relative overflow-hidden rounded-xl bg-surface shadow-soft transition-shadow hover:shadow-lift">
      {visit.photo_url ? (
        <img
          src={visit.photo_url}
          alt={photoAlt(visit.dish_name, place.name)}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={`No photo for this visit to ${place.name}`}
          className="grid aspect-[4/3] w-full place-items-center bg-surface-sunken text-ink-muted"
        >
          <ImageOff aria-hidden className="h-8 w-8" />
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-h3 leading-snug">
              {hidePlace ? (
                title
              ) : (
                <Link
                  to={`/places/${place.id}`}
                  className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-[-2px]"
                >
                  {title}
                </Link>
              )}
            </h3>
            {!hidePlace && (
              <p className="truncate text-small text-ink-muted">
                {visit.dish_name ? `${place.name} · ` : ''}
                {placeLocation(place)}
              </p>
            )}
          </div>
          <time dateTime={visit.visited_at} className="shrink-0 pt-1 text-small text-ink-muted">
            {formatVisitDate(visit.visited_at)}
          </time>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={ratingTone[visit.rating]}>{RATING_LABEL[visit.rating]}</Chip>
          {price && (
            <Chip>
              <span className="sr-only">Price: </span>
              {price}
            </Chip>
          )}
          {visit.would_go_back === true && (
            <Chip tone="leaf">
              <Undo2 aria-hidden className="h-3 w-3" />
              Would go back
            </Chip>
          )}
          {visit.feeling && (
            <Chip tone="mist">Felt {FEELING_LABEL[visit.feeling].toLowerCase()}</Chip>
          )}
        </div>

        {showHealthTags && visit.health_tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
            {visit.health_tags.map((tag) => (
              <li key={tag}>
                <Chip tone="primary">{HEALTH_TAG_LABEL[tag]}</Chip>
              </li>
            ))}
          </ul>
        )}

        {visit.note && <p className="text-body text-ink-soft">{visit.note}</p>}
      </div>
    </article>
  )
}

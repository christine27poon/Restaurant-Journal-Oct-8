import { useId, useState, type KeyboardEvent } from 'react'
import { Check, Plus, Search } from 'lucide-react'
import { usePlaces } from '@/hooks/queries'
import type { PlaceChoice } from '@/lib/schemas'
import { placeLocation } from '@/lib/format'
import { searchPlaces } from '@/lib/places'
import { cn } from '@/lib/cn'
import type { Place } from '@/types'

interface PlaceComboboxProps {
  id: string
  value: PlaceChoice | null
  onChange: (choice: PlaceChoice | null, place?: Place) => void
  invalid?: boolean
  describedBy?: string
  placeholder?: string
}

/**
 * Search the saved places or type a custom name (ARIA 1.2 combobox with a listbox popup).
 * Arrow keys move, Enter picks, Escape closes.
 */
export function PlaceCombobox({
  id,
  value,
  onChange,
  invalid,
  describedBy,
  placeholder = 'Search or type a place name',
}: PlaceComboboxProps) {
  const listId = useId()
  const [text, setText] = useState(value?.name ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  // Load the (small) place list once and filter locally so options always match the typed text.
  // If the list grows large or moves to Supabase, switch this to a debounced server search.
  const places = usePlaces()

  const trimmed = text.trim()
  const matches = searchPlaces(places.data ?? [], trimmed).slice(0, 6)
  const exact = matches.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())
  const showCustom = trimmed.length > 0 && !exact
  const optionCount = matches.length + (showCustom ? 1 : 0)

  const pickPlace = (place: Place) => {
    setText(place.name)
    setOpen(false)
    onChange({ kind: 'existing', placeId: place.id, name: place.name }, place)
  }
  const pickCustom = () => {
    setOpen(false)
    onChange({ kind: 'custom', name: trimmed })
  }
  const pickIndex = (index: number) => {
    const place = matches[index]
    if (place) pickPlace(place)
    else if (showCustom) pickCustom()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((i) => (optionCount ? (i + 1) % optionCount : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (optionCount ? (i - 1 + optionCount) % optionCount : 0))
    } else if (event.key === 'Enter' && open && optionCount) {
      event.preventDefault()
      pickIndex(active)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const optionId = (index: number) => `${listId}-opt-${index}`
  const expanded = open && optionCount > 0

  return (
    <div className="relative">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
        />
        <input
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={expanded ? optionId(active) : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          value={text}
          placeholder={placeholder}
          onChange={(event) => {
            setText(event.target.value)
            setActive(0)
            setOpen(true)
            // Typed text counts as a custom place until the user picks a match from the list.
            const name = event.target.value.trim()
            onChange(name ? { kind: 'custom', name } : null)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className={cn(
            'block min-h-touch w-full rounded-lg border bg-surface pl-11 pr-4 text-body text-ink placeholder:text-ink-muted',
            invalid ? 'border-danger' : 'border-line-strong',
          )}
        />
      </div>
      <ul
        id={listId}
        role="listbox"
        aria-label="Places"
        hidden={!expanded}
        className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-line bg-surface py-1 shadow-lift"
      >
        {matches.map((place, index) => (
          <li
            key={place.id}
            id={optionId(index)}
            role="option"
            aria-selected={index === active}
            // mousedown (not click) so the input's blur doesn't close the list first.
            onMouseDown={(event) => {
              event.preventDefault()
              pickPlace(place)
            }}
            onMouseEnter={() => setActive(index)}
            className={cn(
              'flex min-h-touch cursor-pointer items-center justify-between gap-3 px-4 py-2',
              index === active && 'bg-primary-50',
            )}
          >
            <span className="min-w-0">
              <span className="block truncate text-body font-medium">{place.name}</span>
              <span className="block truncate text-small text-ink-muted">
                {placeLocation(place)}
              </span>
            </span>
            {value?.kind === 'existing' && value.placeId === place.id && (
              <Check aria-hidden className="h-5 w-5 shrink-0 text-sage-700" />
            )}
          </li>
        ))}
        {showCustom && (
          <li
            id={optionId(matches.length)}
            role="option"
            aria-selected={active === matches.length}
            onMouseDown={(event) => {
              event.preventDefault()
              pickCustom()
            }}
            onMouseEnter={() => setActive(matches.length)}
            className={cn(
              'flex min-h-touch cursor-pointer items-center gap-2 px-4 py-2 text-body',
              active === matches.length && 'bg-primary-50',
            )}
          >
            <Plus aria-hidden className="h-5 w-5 shrink-0 text-primary-700" />
            <span className="truncate">
              Add “<strong className="font-medium">{trimmed}</strong>” as a new place
            </span>
          </li>
        )}
      </ul>
      {value && (
        <p className="mt-1.5 text-small text-sage-700" aria-live="polite">
          {value.kind === 'existing'
            ? 'Place selected'
            : 'New place — it will be added to your places'}
        </p>
      )}
    </div>
  )
}

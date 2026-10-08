import type { Place, PriceTier, Rating } from '@/types'
import type { ChipTone } from '@/lib/chipTones'

export const priceLabel = (tier: PriceTier | null | undefined) => (tier ? '$'.repeat(tier) : null)

const DAY_MS = 24 * 60 * 60 * 1000

/** "Today", "Yesterday", "3 days ago", then "Oct 5" (adds the year when it differs). */
export function formatVisitDate(iso: string, now = new Date()): string {
  const date = new Date(iso)
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((startOf(now) - startOf(date)) / DAY_MS)
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
  })
}

export const ratingTone: Record<Rating, ChipTone> = {
  loved: 'honey',
  fine: 'leaf',
  not_for_me: 'mist',
}

export function placeLocation(place: Pick<Place, 'neighborhood' | 'city'>): string {
  return [place.neighborhood, place.city].filter(Boolean).join(', ')
}

export function photoAlt(dish: string | null, placeName: string): string {
  return dish ? `${dish} at ${placeName}` : `A meal at ${placeName}`
}

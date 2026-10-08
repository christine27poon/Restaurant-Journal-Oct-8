import type { HealthTag, Place, VisitWithPlace } from '@/types'

/** Tags you've used at a place, most frequent first. Purely a tally of your own labels. */
export function tagsFromVisits(visits: Array<Pick<VisitWithPlace, 'health_tags'>>): HealthTag[] {
  const counts = new Map<HealthTag, number>()
  for (const visit of visits) {
    for (const tag of visit.health_tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
}

/**
 * Case-insensitive match on name, cuisine, neighborhood and city. Used by the combobox so
 * results are never a render behind the typed text.
 */
export function searchPlaces(places: Place[], query: string): Place[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return places
  return places.filter((place) =>
    [place.name, place.cuisine, place.neighborhood, place.city].some((field) =>
      field?.toLowerCase().includes(needle),
    ),
  )
}

import type { HealthTag, VisitWithPlace } from '@/types'

/** Tags you've used at a place, most frequent first. Purely a tally of your own labels. */
export function tagsFromVisits(visits: Array<Pick<VisitWithPlace, 'health_tags'>>): HealthTag[] {
  const counts = new Map<HealthTag, number>()
  for (const visit of visits) {
    for (const tag of visit.health_tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
}

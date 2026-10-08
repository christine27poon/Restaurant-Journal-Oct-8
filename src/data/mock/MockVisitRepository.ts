import type { VisitRepository } from '../repositories'
import { DataError } from '../errors'
import type { NewVisit, Visit, VisitPatch, VisitWithPlace } from '@/types'
import { LOCAL_USER_ID, delay, newId, nowIso, readCollection, writeCollection } from './storage'
import { seedVisits } from './seed'
import { loadPlaces } from './MockPlaceRepository'

const KEY = 'visits'
const load = () => readCollection<Visit>(KEY, seedVisits)

function withPlace(visit: Visit): VisitWithPlace | null {
  const place = loadPlaces().find((p) => p.id === visit.place_id)
  return place ? { ...visit, place } : null
}

export class MockVisitRepository implements VisitRepository {
  async list(query?: { placeId?: string; limit?: number }) {
    await delay()
    const rows = load()
      .filter((v) => !query?.placeId || v.place_id === query.placeId)
      .sort((a, b) => b.visited_at.localeCompare(a.visited_at))
      .map(withPlace)
      .filter((v): v is VisitWithPlace => v !== null)
    return query?.limit ? rows.slice(0, query.limit) : rows
  }

  async get(id: string) {
    await delay()
    const visit = load().find((v) => v.id === id)
    return visit ? withPlace(visit) : null
  }

  async create(input: NewVisit) {
    await delay()
    const now = nowIso()
    const visit: Visit = {
      id: newId(),
      user_id: LOCAL_USER_ID,
      place_id: input.place_id,
      rating: input.rating,
      visited_at: input.visited_at ?? now,
      photo_url: input.photo_url ?? null,
      dish_name: input.dish_name ?? null,
      would_go_back: input.would_go_back ?? null,
      price_tier: input.price_tier ?? null,
      health_tags: input.health_tags ?? [],
      feeling: input.feeling ?? null,
      note: input.note ?? null,
      story: input.story ?? null,
      created_at: now,
      updated_at: now,
    }
    writeCollection(KEY, [...load(), visit])
    return visit
  }

  async update(id: string, patch: VisitPatch) {
    await delay()
    const all = load()
    const index = all.findIndex((v) => v.id === id)
    const current = all[index]
    if (!current) throw new DataError('not_found', 'We couldn’t find that visit.')
    const updated: Visit = { ...current, ...patch, updated_at: nowIso() }
    all[index] = updated
    writeCollection(KEY, all)
    return updated
  }

  async remove(id: string) {
    await delay()
    writeCollection(
      KEY,
      load().filter((v) => v.id !== id),
    )
  }
}

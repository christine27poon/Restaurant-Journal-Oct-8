import type { WishlistRepository } from '../repositories'
import { DataError } from '../errors'
import type { WishlistEntry, WishlistItem } from '@/types'
import { LOCAL_USER_ID, delay, newId, nowIso, readCollection, writeCollection } from './storage'
import { seedWishlist } from './seed'
import { loadPlaces } from './MockPlaceRepository'

const KEY = 'wishlist'
const load = () => readCollection<WishlistItem>(KEY, seedWishlist)

export class MockWishlistRepository implements WishlistRepository {
  async list() {
    await delay()
    const places = loadPlaces()
    return load()
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .flatMap((item): WishlistEntry[] => {
        const place = places.find((p) => p.id === item.place_id)
        return place ? [{ ...item, place }] : []
      })
  }

  async add(placeId: string, note?: string | null) {
    await delay()
    const all = load()
    const existing = all.find((i) => i.place_id === placeId && i.status === 'want')
    if (existing) return existing
    const item: WishlistItem = {
      id: newId(),
      user_id: LOCAL_USER_ID,
      place_id: placeId,
      note: note?.trim() || null,
      status: 'want',
      visited_at: null,
      created_at: nowIso(),
    }
    writeCollection(KEY, [...all, item])
    return item
  }

  async remove(id: string) {
    await delay()
    writeCollection(
      KEY,
      load().filter((i) => i.id !== id),
    )
  }

  async markVisited(id: string) {
    await delay()
    const all = load()
    const index = all.findIndex((i) => i.id === id)
    const current = all[index]
    if (!current) throw new DataError('not_found', 'We couldn’t find that wishlist item.')
    const updated: WishlistItem = { ...current, status: 'visited', visited_at: nowIso() }
    all[index] = updated
    writeCollection(KEY, all)
    return updated
  }
}

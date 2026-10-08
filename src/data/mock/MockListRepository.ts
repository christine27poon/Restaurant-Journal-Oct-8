import type { ListRepository } from '../repositories'
import { DataError } from '../errors'
import type {
  NewPlaceList,
  PlaceList,
  PlaceListDetail,
  PlaceListItem,
  PlaceListPatch,
  PlaceListSummary,
} from '@/types'
import { LOCAL_USER_ID, delay, newId, nowIso, readCollection, writeCollection } from './storage'
import { seedLists } from './seed'
import { loadPlaces } from './MockPlaceRepository'

const LISTS_KEY = 'lists'
const ITEMS_KEY = 'list_items'
const loadLists = () => readCollection<PlaceList>(LISTS_KEY, () => seedLists().lists)
const loadItems = () => readCollection<PlaceListItem>(ITEMS_KEY, () => seedLists().items)

const sortedItems = (listId: string) =>
  loadItems()
    .filter((i) => i.list_id === listId)
    .sort((a, b) => a.position - b.position)

export class MockListRepository implements ListRepository {
  async list() {
    await delay()
    return loadLists()
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .map((list): PlaceListSummary => {
        const ids = sortedItems(list.id).map((i) => i.place_id)
        return { ...list, place_count: ids.length, place_ids: ids }
      })
  }

  async get(id: string) {
    await delay()
    const list = loadLists().find((l) => l.id === id)
    if (!list) return null
    const items = sortedItems(id)
    const places = loadPlaces()
    const detail: PlaceListDetail = {
      ...list,
      items,
      places: items.flatMap((i) => places.find((p) => p.id === i.place_id) ?? []),
    }
    return detail
  }

  async create(input: NewPlaceList) {
    await delay()
    const now = nowIso()
    const list: PlaceList = {
      id: newId(),
      user_id: LOCAL_USER_ID,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      created_at: now,
      updated_at: now,
    }
    writeCollection(LISTS_KEY, [...loadLists(), list])
    return list
  }

  async update(id: string, patch: PlaceListPatch) {
    await delay()
    const all = loadLists()
    const index = all.findIndex((l) => l.id === id)
    const current = all[index]
    if (!current) throw new DataError('not_found', 'We couldn’t find that list.')
    const updated: PlaceList = {
      ...current,
      name: patch.name?.trim() || current.name,
      description:
        patch.description === undefined ? current.description : patch.description?.trim() || null,
      updated_at: nowIso(),
    }
    all[index] = updated
    writeCollection(LISTS_KEY, all)
    return updated
  }

  async remove(id: string) {
    await delay()
    writeCollection(
      LISTS_KEY,
      loadLists().filter((l) => l.id !== id),
    )
    writeCollection(
      ITEMS_KEY,
      loadItems().filter((i) => i.list_id !== id),
    )
  }

  async addPlace(listId: string, placeId: string) {
    await delay()
    const items = loadItems()
    if (items.some((i) => i.list_id === listId && i.place_id === placeId)) return
    const position = items.filter((i) => i.list_id === listId).length
    writeCollection(ITEMS_KEY, [
      ...items,
      { id: newId(), list_id: listId, place_id: placeId, position, created_at: nowIso() },
    ])
    await this.touch(listId)
  }

  async removePlace(listId: string, placeId: string) {
    await delay()
    const remaining = loadItems().filter((i) => !(i.list_id === listId && i.place_id === placeId))
    // Keep positions contiguous per list.
    const reindexed = remaining.map((item) => ({
      ...item,
      position: remaining.filter((o) => o.list_id === item.list_id && o.position < item.position)
        .length,
    }))
    writeCollection(ITEMS_KEY, reindexed)
    await this.touch(listId)
  }

  async getShareUrl(id: string) {
    await delay(50)
    return `https://tablenotes.example/lists/${id}`
  }

  private async touch(listId: string) {
    const all = loadLists()
    writeCollection(
      LISTS_KEY,
      all.map((l) => (l.id === listId ? { ...l, updated_at: nowIso() } : l)),
    )
  }
}

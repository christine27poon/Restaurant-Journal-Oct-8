import type { ListRepository } from '../repositories'
import type { NewPlaceList, PlaceListDetail, PlaceListPatch, PlaceListSummary } from '@/types'
import type { Db } from './client'
import { assertOk, unwrap, unwrapMaybe } from './errors'
import { toPlace, toPlaceList } from './mappers'

export class SupabaseListRepository implements ListRepository {
  private readonly db: Db

  constructor(db: Db) {
    this.db = db
  }

  async list() {
    const rows = unwrap(
      await this.db
        .from('place_lists')
        .select('*, place_list_items(place_id, position)')
        .order('updated_at', { ascending: false }),
    )
    return rows.map((row): PlaceListSummary => {
      const ids = [...row.place_list_items]
        .sort((a, b) => a.position - b.position)
        .map((i) => i.place_id)
      return { ...toPlaceList(row), place_count: ids.length, place_ids: ids }
    })
  }

  async get(id: string) {
    const row = unwrapMaybe(
      await this.db
        .from('place_lists')
        .select('*, place_list_items(*, place:places(*))')
        .eq('id', id)
        .maybeSingle(),
    )
    if (!row) return null
    const items = [...row.place_list_items].sort((a, b) => a.position - b.position)
    const detail: PlaceListDetail = {
      ...toPlaceList(row),
      items: items.map(({ id: itemId, list_id, place_id, position, created_at }) => ({
        id: itemId,
        list_id,
        place_id,
        position,
        created_at,
      })),
      places: items.map((item) => toPlace(item.place)),
    }
    return detail
  }

  async create(input: NewPlaceList) {
    // user_id defaults to auth.uid() in the database.
    const row = unwrap(
      await this.db
        .from('place_lists')
        .insert({ name: input.name.trim(), description: input.description?.trim() || null })
        .select()
        .single(),
    )
    return toPlaceList(row)
  }

  async update(id: string, patch: PlaceListPatch) {
    const changes: { name?: string; description?: string | null } = {}
    if (patch.name?.trim()) changes.name = patch.name.trim()
    if (patch.description !== undefined) changes.description = patch.description?.trim() || null
    const row = unwrap(
      await this.db.from('place_lists').update(changes).eq('id', id).select().single(),
    )
    return toPlaceList(row)
  }

  async remove(id: string) {
    assertOk(await this.db.from('place_lists').delete().eq('id', id))
  }

  async addPlace(listId: string, placeId: string) {
    const last = unwrapMaybe(
      await this.db
        .from('place_list_items')
        .select('position')
        .eq('list_id', listId)
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle(),
    )
    assertOk(
      await this.db
        .from('place_list_items')
        .upsert(
          { list_id: listId, place_id: placeId, position: (last?.position ?? -1) + 1 },
          { onConflict: 'list_id,place_id', ignoreDuplicates: true },
        ),
    )
  }

  async removePlace(listId: string, placeId: string) {
    assertOk(
      await this.db.from('place_list_items').delete().eq('list_id', listId).eq('place_id', placeId),
    )
  }

  async getShareUrl(id: string) {
    // Placeholder until public sharing exists (it would need a public-read policy and a route).
    return `https://tablenotes.example/lists/${id}`
  }
}

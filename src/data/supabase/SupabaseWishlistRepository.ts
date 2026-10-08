import type { WishlistRepository } from '../repositories'
import type { WishlistEntry } from '@/types'
import type { Db } from './client'
import { assertOk, toDataError, unwrap, unwrapMaybe } from './errors'
import { toPlace, toWishlistItem } from './mappers'

const UNIQUE_VIOLATION = '23505'

export class SupabaseWishlistRepository implements WishlistRepository {
  private readonly db: Db

  constructor(db: Db) {
    this.db = db
  }

  async list() {
    const rows = unwrap(
      await this.db
        .from('wishlist_items')
        .select('*, place:places(*)')
        .order('created_at', { ascending: false }),
    )
    return rows.map((row): WishlistEntry => ({ ...toWishlistItem(row), place: toPlace(row.place) }))
  }

  async add(placeId: string, note?: string | null) {
    const findExisting = async () =>
      unwrapMaybe(
        await this.db
          .from('wishlist_items')
          .select()
          .eq('place_id', placeId)
          .eq('status', 'want')
          .maybeSingle(),
      )

    const existing = await findExisting()
    if (existing) return toWishlistItem(existing)

    const { data, error } = await this.db
      .from('wishlist_items')
      .insert({ place_id: placeId, note: note?.trim() || null })
      .select()
      .single()
    if (error) {
      // Two quick taps can race past the check above; the unique index keeps one row.
      if (error.code === UNIQUE_VIOLATION) {
        const raced = await findExisting()
        if (raced) return toWishlistItem(raced)
      }
      throw toDataError(error)
    }
    return toWishlistItem(data)
  }

  async remove(id: string) {
    assertOk(await this.db.from('wishlist_items').delete().eq('id', id))
  }

  async markVisited(id: string) {
    const row = unwrap(
      await this.db
        .from('wishlist_items')
        .update({ status: 'visited', visited_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single(),
    )
    return toWishlistItem(row)
  }
}

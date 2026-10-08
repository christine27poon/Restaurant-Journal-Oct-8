import type { VisitRepository } from '../repositories'
import type { NewVisit, VisitPatch, VisitWithPlace } from '@/types'
import type { Db } from './client'
import { assertOk, unwrap, unwrapMaybe } from './errors'
import { toPlace, toVisit } from './mappers'
import { withSignedPhotoUrls } from './photos'

const WITH_PLACE = '*, place:places(*)'

export class SupabaseVisitRepository implements VisitRepository {
  private readonly db: Db

  constructor(db: Db) {
    this.db = db
  }

  async list(query?: { placeId?: string; limit?: number }) {
    let request = this.db
      .from('visits')
      .select(WITH_PLACE)
      .order('visited_at', { ascending: false })
    if (query?.placeId) request = request.eq('place_id', query.placeId)
    if (query?.limit) request = request.limit(query.limit)
    const rows = unwrap(await request).map((row): VisitWithPlace => ({
      ...toVisit(row),
      place: toPlace(row.place),
    }))
    return withSignedPhotoUrls(this.db, rows)
  }

  async get(id: string) {
    const row = unwrapMaybe(
      await this.db.from('visits').select(WITH_PLACE).eq('id', id).maybeSingle(),
    )
    if (!row) return null
    const [visit] = await withSignedPhotoUrls(this.db, [
      { ...toVisit(row), place: toPlace(row.place) },
    ])
    return visit ?? null
  }

  async create(input: NewVisit) {
    // user_id defaults to auth.uid() in the database.
    const row = unwrap(await this.db.from('visits').insert(input).select().single())
    return toVisit(row)
  }

  async update(id: string, patch: VisitPatch) {
    const row = unwrap(await this.db.from('visits').update(patch).eq('id', id).select().single())
    return toVisit(row)
  }

  async remove(id: string) {
    assertOk(await this.db.from('visits').delete().eq('id', id))
  }
}

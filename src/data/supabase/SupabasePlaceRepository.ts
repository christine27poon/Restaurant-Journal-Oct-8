import type { PlaceRepository } from '../repositories'
import type { NewPlace } from '@/types'
import type { Db } from './client'
import { unwrap, unwrapMaybe } from './errors'
import { toPlace } from './mappers'

/** Escapes characters that are special in a PostgREST `ilike` filter. */
const escapeLike = (value: string) => value.replace(/[%_\\,()]/g, ' ').trim()

export class SupabasePlaceRepository implements PlaceRepository {
  private readonly db: Db

  constructor(db: Db) {
    this.db = db
  }

  async list(query?: { search?: string }) {
    let request = this.db.from('places').select('*').order('name')
    const needle = escapeLike(query?.search ?? '')
    if (needle) {
      const pattern = `%${needle}%`
      request = request.or(
        `name.ilike.${pattern},cuisine.ilike.${pattern},neighborhood.ilike.${pattern},city.ilike.${pattern}`,
      )
    }
    return unwrap(await request).map(toPlace)
  }

  async get(id: string) {
    const row = unwrapMaybe(await this.db.from('places').select('*').eq('id', id).maybeSingle())
    return row ? toPlace(row) : null
  }

  async create(input: NewPlace) {
    // user_id defaults to auth.uid() in the database.
    const row = unwrap(
      await this.db
        .from('places')
        .insert({
          name: input.name.trim(),
          city: input.city?.trim() || 'Bay Area',
          neighborhood: input.neighborhood ?? null,
          address: input.address ?? null,
          cuisine: input.cuisine ?? null,
          price_tier: input.price_tier ?? null,
          source: 'custom',
        })
        .select()
        .single(),
    )
    return toPlace(row)
  }
}

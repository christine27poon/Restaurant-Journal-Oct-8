import type { ProfileRepository } from '../repositories'
import { DataError } from '../errors'
import type { Profile, ProfilePatch } from '@/types'
import type { Db } from './client'
import { unwrap, unwrapMaybe } from './errors'
import { toProfile } from './mappers'

export class SupabaseProfileRepository implements ProfileRepository {
  private readonly db: Db

  constructor(db: Db) {
    this.db = db
  }

  private async userId() {
    const { data } = await this.db.auth.getSession()
    const user = data.session?.user
    if (!user) throw new DataError('auth', 'Please sign in to continue.')
    return user
  }

  async get(): Promise<Profile> {
    const user = await this.userId()
    const row = unwrapMaybe(await this.db.from('profiles').select().eq('id', user.id).maybeSingle())
    if (row) return toProfile(row)
    // The signup trigger normally creates this row; recover if it's somehow missing.
    const created = unwrap(
      await this.db
        .from('profiles')
        .insert({ id: user.id, display_name: user.email?.split('@')[0] || 'Friend' })
        .select()
        .single(),
    )
    return toProfile(created)
  }

  async update(patch: ProfilePatch): Promise<Profile> {
    const current = await this.get()
    const row = unwrap(
      await this.db
        .from('profiles')
        .update({
          display_name: patch.display_name?.trim() || current.display_name,
          preferences: { ...current.preferences, ...patch.preferences },
        })
        .eq('id', current.id)
        .select()
        .single(),
    )
    return toProfile(row)
  }
}

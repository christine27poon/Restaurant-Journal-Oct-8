import type { ProfileRepository } from '../repositories'
import type { Profile, ProfilePatch } from '@/types'
import { delay, nowIso, readValue, writeValue } from './storage'
import { seedProfile } from './seed'

const KEY = 'profile'

export class MockProfileRepository implements ProfileRepository {
  async get() {
    await delay()
    return readValue<Profile>(KEY, seedProfile)
  }

  async update(patch: ProfilePatch) {
    await delay()
    const current = readValue<Profile>(KEY, seedProfile)
    const updated: Profile = {
      ...current,
      display_name: patch.display_name?.trim() || current.display_name,
      preferences: { ...current.preferences, ...patch.preferences },
      updated_at: nowIso(),
    }
    writeValue(KEY, updated)
    return updated
  }
}

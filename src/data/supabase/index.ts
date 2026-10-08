import type { DataService } from '../repositories'
import { createSupabaseClient } from './client'
import { SupabaseAuthService } from './SupabaseAuthService'
import { SupabaseListRepository } from './SupabaseListRepository'
import { SupabasePhotoStorage } from './SupabasePhotoStorage'
import { SupabasePlaceRepository } from './SupabasePlaceRepository'
import { SupabaseProfileRepository } from './SupabaseProfileRepository'
import { SupabaseSampleData } from './SupabaseSampleData'
import { SupabaseVisitRepository } from './SupabaseVisitRepository'
import { SupabaseWishlistRepository } from './SupabaseWishlistRepository'

/** Supabase implementation of the data layer (see supabase/migrations for the schema). */
export function createSupabaseDataService(url: string, anonKey: string): DataService {
  const db = createSupabaseClient(url, anonKey)
  return {
    auth: new SupabaseAuthService(db),
    places: new SupabasePlaceRepository(db),
    visits: new SupabaseVisitRepository(db),
    wishlist: new SupabaseWishlistRepository(db),
    lists: new SupabaseListRepository(db),
    profile: new SupabaseProfileRepository(db),
    photos: new SupabasePhotoStorage(db),
    samples: new SupabaseSampleData(db),
  }
}

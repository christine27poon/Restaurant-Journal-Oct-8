import type { DataService } from '../repositories'
import { MockListRepository } from './MockListRepository'
import { MockPhotoStorage } from './MockPhotoStorage'
import { MockPlaceRepository } from './MockPlaceRepository'
import { MockProfileRepository } from './MockProfileRepository'
import { MockVisitRepository } from './MockVisitRepository'
import { MockWishlistRepository } from './MockWishlistRepository'

/** localStorage + seed-data implementation of the data layer. */
export function createMockDataService(): DataService {
  return {
    places: new MockPlaceRepository(),
    visits: new MockVisitRepository(),
    wishlist: new MockWishlistRepository(),
    lists: new MockListRepository(),
    profile: new MockProfileRepository(),
    photos: new MockPhotoStorage(),
  }
}

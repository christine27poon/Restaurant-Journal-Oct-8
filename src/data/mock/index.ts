import type { DataService } from '../repositories'
import { MockAuthService } from './MockAuthService'
import { MockListRepository } from './MockListRepository'
import { MockPhotoStorage } from './MockPhotoStorage'
import { MockPlaceRepository } from './MockPlaceRepository'
import { MockProfileRepository } from './MockProfileRepository'
import { MockSampleData } from './MockSampleData'
import { MockVisitRepository } from './MockVisitRepository'
import { MockWishlistRepository } from './MockWishlistRepository'

/** localStorage + seed-data implementation of the data layer. */
export function createMockDataService(): DataService {
  return {
    auth: new MockAuthService(),
    places: new MockPlaceRepository(),
    visits: new MockVisitRepository(),
    wishlist: new MockWishlistRepository(),
    lists: new MockListRepository(),
    profile: new MockProfileRepository(),
    photos: new MockPhotoStorage(),
    samples: new MockSampleData(),
  }
}

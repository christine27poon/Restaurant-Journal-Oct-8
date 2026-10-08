import type { SampleDataService } from '../repositories'
import type { PlaceList, PlaceListItem, Visit, WishlistItem } from '@/types'
import { delay, readCollection, writeCollection } from './storage'
import { seedLists, seedVisits, seedWishlist } from './seed'

export class MockSampleData implements SampleDataService {
  async load() {
    await delay()
    const visits = readCollection<Visit>('visits', seedVisits)
    const wishlist = readCollection<WishlistItem>('wishlist', seedWishlist)
    const lists = readCollection<PlaceList>('lists', () => seedLists().lists)
    if (visits.length || wishlist.length || lists.length) return
    writeCollection('visits', seedVisits())
    writeCollection('wishlist', seedWishlist())
    const sample = seedLists()
    writeCollection('lists', sample.lists)
    writeCollection<PlaceListItem>('list_items', sample.items)
  }
}

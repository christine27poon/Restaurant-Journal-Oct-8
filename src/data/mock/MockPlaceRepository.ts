import type { PlaceRepository } from '../repositories'
import type { NewPlace, Place } from '@/types'
import { delay, newId, nowIso, readCollection, writeCollection } from './storage'
import { seedPlaces } from './seed'

export const PLACES_KEY = 'places'
export const loadPlaces = () => readCollection<Place>(PLACES_KEY, seedPlaces)

export class MockPlaceRepository implements PlaceRepository {
  async list(query?: { search?: string }) {
    await delay()
    const needle = query?.search?.trim().toLowerCase()
    const places = loadPlaces()
    const matches = needle
      ? places.filter((p) =>
          [p.name, p.cuisine, p.neighborhood, p.city]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(needle)),
        )
      : places
    return [...matches].sort((a, b) => a.name.localeCompare(b.name))
  }

  async get(id: string) {
    await delay()
    return loadPlaces().find((p) => p.id === id) ?? null
  }

  async create(input: NewPlace) {
    await delay()
    const place: Place = {
      id: newId(),
      name: input.name.trim(),
      city: input.city?.trim() || 'Bay Area',
      neighborhood: input.neighborhood ?? null,
      address: input.address ?? null,
      cuisine: input.cuisine ?? null,
      price_tier: input.price_tier ?? null,
      lat: null,
      lng: null,
      source: 'custom',
      created_at: nowIso(),
    }
    writeCollection(PLACES_KEY, [...loadPlaces(), place])
    return place
  }
}

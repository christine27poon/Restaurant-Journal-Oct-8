import type { Place } from './place'

export interface PlaceList {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface PlaceListItem {
  id: string
  list_id: string
  place_id: string
  position: number
  created_at: string
}

/** What the lists index needs: counts and membership without loading every place. */
export interface PlaceListSummary extends PlaceList {
  place_count: number
  place_ids: string[]
}

/** A list with its places in order. */
export interface PlaceListDetail extends PlaceList {
  items: PlaceListItem[]
  places: Place[]
}

export interface NewPlaceList {
  name: string
  description?: string | null
}

export type PlaceListPatch = Partial<NewPlaceList>

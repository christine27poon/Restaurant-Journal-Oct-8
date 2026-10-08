import type { Database } from './database.types'
import type {
  Place,
  PlaceList,
  PriceTier,
  Profile,
  ProfilePreferences,
  Visit,
  WishlistItem,
} from '@/types'

type Tables = Database['public']['Tables']
type PlaceRow = Tables['places']['Row']
type VisitRow = Tables['visits']['Row']
type WishlistRow = Tables['wishlist_items']['Row']
type ListRow = Tables['place_lists']['Row']
type ProfileRow = Tables['profiles']['Row']

export const toTier = (value: number | null): PriceTier | null =>
  value === 1 || value === 2 || value === 3 || value === 4 ? value : null

export const toPlace = (row: PlaceRow): Place => ({
  id: row.id,
  name: row.name,
  neighborhood: row.neighborhood,
  city: row.city,
  address: row.address,
  cuisine: row.cuisine,
  price_tier: toTier(row.price_tier),
  lat: row.lat,
  lng: row.lng,
  source: row.source,
  created_at: row.created_at,
})

export const toVisit = (row: VisitRow): Visit => ({
  id: row.id,
  user_id: row.user_id,
  place_id: row.place_id,
  visited_at: row.visited_at,
  photo_url: row.photo_url,
  dish_name: row.dish_name,
  rating: row.rating,
  would_go_back: row.would_go_back,
  price_tier: toTier(row.price_tier),
  health_tags: row.health_tags,
  feeling: row.feeling,
  note: row.note,
  story: row.story,
  created_at: row.created_at,
  updated_at: row.updated_at,
})

export const toWishlistItem = (row: WishlistRow): WishlistItem => ({
  id: row.id,
  user_id: row.user_id,
  place_id: row.place_id,
  note: row.note,
  status: row.status,
  visited_at: row.visited_at,
  created_at: row.created_at,
})

export const toPlaceList = (row: ListRow): PlaceList => ({
  id: row.id,
  user_id: row.user_id,
  name: row.name,
  description: row.description,
  created_at: row.created_at,
  updated_at: row.updated_at,
})

const DEFAULT_PREFERENCES: ProfilePreferences = {
  show_health_tags: true,
  default_price_tier: null,
  home_city: null,
}

/** `preferences` is free-form jsonb, so read each key defensively. */
export function toPreferences(value: ProfileRow['preferences']): ProfilePreferences {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return DEFAULT_PREFERENCES
  }
  const { show_health_tags, default_price_tier, home_city } = value
  return {
    show_health_tags:
      typeof show_health_tags === 'boolean'
        ? show_health_tags
        : DEFAULT_PREFERENCES.show_health_tags,
    default_price_tier: typeof default_price_tier === 'number' ? toTier(default_price_tier) : null,
    home_city: typeof home_city === 'string' ? home_city : null,
  }
}

export const toProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  display_name: row.display_name,
  preferences: toPreferences(row.preferences),
  created_at: row.created_at,
  updated_at: row.updated_at,
})

import type { Place } from './place'

export interface WishlistItem {
  id: string
  user_id: string
  place_id: string
  note: string | null
  status: 'want' | 'visited'
  visited_at: string | null
  created_at: string
}

export interface WishlistEntry extends WishlistItem {
  place: Place
}

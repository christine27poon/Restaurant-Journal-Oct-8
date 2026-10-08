import type { Place, PriceTier } from './place'

export type Rating = 'loved' | 'fine' | 'not_for_me'

/** Self-reported labels only — not nutrition claims. */
export type HealthTag =
  'light' | 'veggie_forward' | 'protein_rich' | 'fresh' | 'comforting' | 'indulgent'

/** Neutral, non-judgmental ways to describe how a meal sat afterward. */
export type Feeling = 'energized' | 'satisfied' | 'comfortable' | 'sleepy' | 'still_hungry'

export interface Visit {
  id: string
  user_id: string
  place_id: string
  visited_at: string
  photo_url: string | null
  dish_name: string | null
  rating: Rating
  would_go_back: boolean | null
  price_tier: PriceTier | null
  health_tags: HealthTag[]
  feeling: Feeling | null
  note: string | null
  /** "The story": who I met, what I learned about the owner. */
  story: string | null
  created_at: string
  updated_at: string
}

/** A visit joined with its place (maps to a Supabase `select('*, place:places(*)')`). */
export interface VisitWithPlace extends Visit {
  place: Place
}

export interface NewVisit {
  place_id: string
  rating: Rating
  visited_at?: string
  photo_url?: string | null
  dish_name?: string | null
  would_go_back?: boolean | null
  price_tier?: PriceTier | null
  health_tags?: HealthTag[]
  feeling?: Feeling | null
  note?: string | null
  story?: string | null
}

export type VisitPatch = Partial<Omit<NewVisit, 'place_id'>>

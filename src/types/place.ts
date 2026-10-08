export type PriceTier = 1 | 2 | 3 | 4

export interface Place {
  id: string
  name: string
  neighborhood: string | null
  city: string
  address: string | null
  cuisine: string | null
  price_tier: PriceTier | null
  /** Reserved for the future map; unused today. */
  lat: number | null
  lng: number | null
  /** 'seed' = sample data, 'custom' = typed in by the user. */
  source: 'seed' | 'custom'
  created_at: string
}

export interface NewPlace {
  name: string
  city?: string
  neighborhood?: string | null
  address?: string | null
  cuisine?: string | null
  price_tier?: PriceTier | null
}

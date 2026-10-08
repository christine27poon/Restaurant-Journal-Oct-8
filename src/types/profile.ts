import type { PriceTier } from './place'

export interface ProfilePreferences {
  show_health_tags: boolean
  default_price_tier: PriceTier | null
  home_city: string | null
}

export interface Profile {
  /** Equals the auth user id once Supabase is connected. */
  id: string
  display_name: string
  preferences: ProfilePreferences
  created_at: string
  updated_at: string
}

export type ProfilePatch = Partial<Pick<Profile, 'display_name'>> & {
  preferences?: Partial<ProfilePreferences>
}

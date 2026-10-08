import type { Feeling, HealthTag, PriceTier, Rating } from '@/types'

export const RATINGS: ReadonlyArray<{ value: Rating; label: string }> = [
  { value: 'loved', label: 'Loved it' },
  { value: 'fine', label: 'It was fine' },
  { value: 'not_for_me', label: 'Not for me' },
]

export const RATING_LABEL: Record<Rating, string> = {
  loved: 'Loved it',
  fine: 'It was fine',
  not_for_me: 'Not for me',
}

export const PRICE_TIERS: ReadonlyArray<{ value: PriceTier; label: string; hint: string }> = [
  { value: 1, label: '$', hint: 'Under $15' },
  { value: 2, label: '$$', hint: '$15–30' },
  { value: 3, label: '$$$', hint: '$30–60' },
  { value: 4, label: '$$$$', hint: '$60+' },
]

/** Self-reported labels, not nutrition claims. */
export const HEALTH_TAGS: ReadonlyArray<{ value: HealthTag; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'veggie_forward', label: 'Veggie-forward' },
  { value: 'protein_rich', label: 'Protein-rich' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'comforting', label: 'Comforting' },
  { value: 'indulgent', label: 'Indulgent' },
]

export const HEALTH_TAG_LABEL: Record<HealthTag, string> = Object.fromEntries(
  HEALTH_TAGS.map((t) => [t.value, t.label]),
) as Record<HealthTag, string>

export const FEELINGS: ReadonlyArray<{ value: Feeling; label: string }> = [
  { value: 'energized', label: 'Energized' },
  { value: 'satisfied', label: 'Satisfied' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'sleepy', label: 'Sleepy' },
  { value: 'still_hungry', label: 'Still hungry' },
]

export const FEELING_LABEL: Record<Feeling, string> = Object.fromEntries(
  FEELINGS.map((f) => [f.value, f.label]),
) as Record<Feeling, string>

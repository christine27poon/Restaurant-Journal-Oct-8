import { z } from 'zod'

export const ratingSchema = z.enum(['loved', 'fine', 'not_for_me'])
export const healthTagSchema = z.enum([
  'light',
  'veggie_forward',
  'protein_rich',
  'fresh',
  'comforting',
  'indulgent',
])
export const feelingSchema = z.enum([
  'energized',
  'satisfied',
  'comfortable',
  'sleepy',
  'still_hungry',
])
export const priceTierSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])

/** Either an existing place or a name the user typed. */
export const placeChoiceSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('existing'), placeId: z.string(), name: z.string() }),
  z.object({
    kind: z.literal('custom'),
    name: z.string().trim().min(1, 'Add a place name').max(120),
  }),
])

export type PlaceChoice = z.infer<typeof placeChoiceSchema>

/** Quick Log: only place and rating are required. */
export const quickLogSchema = z.object({
  place: placeChoiceSchema.nullable().refine((value) => value !== null, {
    message: 'Choose a place or type its name',
  }),
  rating: ratingSchema.nullable().refine((value) => value !== null, {
    message: 'Pick how it went',
  }),
  photo: z.instanceof(File).nullable(),
  dish_name: z.string().max(120, 'Keep it under 120 characters'),
  would_go_back: z.boolean().nullable(),
  price_tier: priceTierSchema.nullable(),
  health_tags: z.array(healthTagSchema),
  feeling: feelingSchema.nullable(),
  note: z.string().max(1000, 'Keep it under 1,000 characters'),
  story: z.string().max(2000, 'Keep it under 2,000 characters'),
})

/** Form state (place/rating start empty) vs. validated output (both present). */
export type QuickLogInput = z.input<typeof quickLogSchema>
export type QuickLogValues = z.output<typeof quickLogSchema>

export const listSchema = z.object({
  name: z.string().trim().min(1, 'Give your list a name').max(80, 'Keep it under 80 characters'),
  description: z.string().max(300, 'Keep it under 300 characters'),
})
export type ListValues = z.infer<typeof listSchema>

export const profileSchema = z.object({
  display_name: z.string().trim().min(1, 'Add a name').max(60, 'Keep it under 60 characters'),
  home_city: z.string().max(60),
  default_price_tier: priceTierSchema.nullable(),
  show_health_tags: z.boolean(),
})
export type ProfileValues = z.infer<typeof profileSchema>

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Add your email')
  .email('That email doesn’t look right')

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Add your password'),
})
export type SignInValues = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  display_name: z.string().trim().min(1, 'Add a name').max(60, 'Keep it under 60 characters'),
  email: emailSchema,
  password: z.string().min(8, 'Use at least 8 characters'),
})
export type SignUpValues = z.infer<typeof signUpSchema>

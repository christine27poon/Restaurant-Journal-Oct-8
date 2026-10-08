import { useState } from 'react'
import { Controller, useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ChoiceGroup } from '@/components/ui/ChoiceGroup'
import { Field, TextArea, TextInput } from '@/components/ui/Field'
import { Toggle } from '@/components/ui/Toggle'
import { useToast } from '@/components/ui/toast/useToast'
import { PlaceCombobox } from '@/components/place/PlaceCombobox'
import { PhotoPicker } from './PhotoPicker'
import { FEELINGS, HEALTH_TAGS, PRICE_TIERS, RATINGS } from '@/lib/constants'
import { quickLogSchema, type QuickLogInput, type QuickLogValues } from '@/lib/schemas'
import { useCreatePlace, usePlaces, useCreateVisit, useSavePhoto } from '@/hooks/queries'
import type { Place, PriceTier } from '@/types'

interface QuickLogFormProps {
  /** Pre-fills the place (e.g. when starting from the wishlist). */
  initialPlace?: Place | null
  wishlistItemId?: string
  showHealthTags: boolean
  /** From the profile; used when the chosen place has no usual price tier. */
  defaultPriceTier?: PriceTier | null
}

const RATING_OPTIONS = RATINGS.map((r) => ({
  ...r,
  tone:
    r.value === 'loved'
      ? ('honey' as const)
      : r.value === 'fine'
        ? ('leaf' as const)
        : ('mist' as const),
}))
const PRICE_OPTIONS = PRICE_TIERS.map((p) => ({ value: p.value, label: p.label, srHint: p.hint }))

/** Focus the first invalid field so keyboard and screen-reader users land on the problem. */
function focusFirstError(errors: FieldErrors<QuickLogInput>) {
  const first = (['place', 'rating'] as const).find((key) => errors[key])
  if (first) document.getElementById(`field-${first}`)?.focus()
}

export function QuickLogForm({
  initialPlace,
  wishlistItemId,
  showHealthTags,
  defaultPriceTier = null,
}: QuickLogFormProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const allPlaces = usePlaces('')
  const createPlace = useCreatePlace()
  const createVisit = useCreateVisit()
  const savePhoto = useSavePhoto()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<QuickLogInput, unknown, QuickLogValues>({
    resolver: zodResolver(quickLogSchema),
    defaultValues: {
      place: initialPlace
        ? { kind: 'existing', placeId: initialPlace.id, name: initialPlace.name }
        : null,
      rating: null,
      photo: null,
      dish_name: '',
      would_go_back: null,
      price_tier: initialPlace?.price_tier ?? defaultPriceTier,
      health_tags: [],
      feeling: null,
      note: '',
      story: '',
    },
  })

  const onSubmit = async (values: QuickLogValues) => {
    const { place, rating } = values
    setFormError(null)
    try {
      let placeId: string
      if (place.kind === 'existing') {
        placeId = place.placeId
      } else {
        // Typed a name that already exists? Reuse it instead of creating a duplicate.
        const match = allPlaces.data?.find((p) => p.name.toLowerCase() === place.name.toLowerCase())
        placeId = match
          ? match.id
          : (await createPlace.mutateAsync({ name: place.name, price_tier: values.price_tier })).id
      }
      const photo_url = values.photo ? await savePhoto.mutateAsync(values.photo) : null
      await createVisit.mutateAsync({
        visit: {
          place_id: placeId,
          rating,
          photo_url,
          dish_name: values.dish_name.trim() || null,
          would_go_back: values.would_go_back,
          price_tier: values.price_tier,
          health_tags: showHealthTags ? values.health_tags : [],
          feeling: values.feeling,
          note: values.note.trim() || null,
          story: values.story.trim() || null,
        },
        wishlistItemId,
      })
      toast.show('Saved to your journal')
      navigate('/')
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'We couldn’t save that just now. Please try again.',
      )
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, focusFirstError)}
      className="mx-auto max-w-content space-y-6"
    >
      <Controller
        control={control}
        name="photo"
        render={({ field }) => <PhotoPicker id="field-photo" onChange={field.onChange} />}
      />

      <Controller
        control={control}
        name="place"
        render={({ field }) => (
          <Field label="Where did you eat?" htmlFor="field-place" error={errors.place?.message}>
            <PlaceCombobox
              id="field-place"
              value={field.value}
              invalid={Boolean(errors.place)}
              describedBy={errors.place ? 'field-place-error' : undefined}
              onChange={(choice, place) => {
                field.onChange(choice)
                // Nice default: carry the place's usual price tier unless the user already chose one.
                if (place && !getFieldState('price_tier').isDirty) {
                  setValue('price_tier', place.price_tier ?? defaultPriceTier)
                }
              }}
            />
          </Field>
        )}
      />

      <Field
        label="What did you have?"
        htmlFor="field-dish"
        optional
        error={errors.dish_name?.message}
      >
        <TextInput
          id="field-dish"
          placeholder="e.g. Beef noodle soup"
          invalid={Boolean(errors.dish_name)}
          {...register('dish_name')}
        />
      </Field>

      <div id="field-rating" tabIndex={-1} className="outline-none">
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <ChoiceGroup
              legend="How did it go?"
              options={RATING_OPTIONS}
              large
              value={field.value}
              onChange={field.onChange}
              error={errors.rating?.message}
            />
          )}
        />
      </div>

      <details className="group rounded-xl border border-line bg-surface">
        <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-body font-medium [&::-webkit-details-marker]:hidden">
          <span>
            Add more details <span className="font-normal text-ink-muted">(optional)</span>
          </span>
          <ChevronDown aria-hidden className="h-5 w-5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-6 border-t border-line p-4">
          <Controller
            control={control}
            name="would_go_back"
            render={({ field }) => (
              <Toggle
                id="field-go-back"
                label="Would go back?"
                checked={field.value === true}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="price_tier"
            render={({ field }) => (
              <ChoiceGroup
                legend="Price"
                optional
                clearable
                options={PRICE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {showHealthTags && (
            <Controller
              control={control}
              name="health_tags"
              render={({ field }) => (
                <ChoiceGroup
                  multiple
                  legend="Tags"
                  optional
                  hint="Your own labels for how the meal felt — nothing is right or wrong."
                  options={HEALTH_TAGS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="feeling"
            render={({ field }) => (
              <ChoiceGroup
                legend="How did you feel afterward?"
                optional
                clearable
                hint="Just for you. There are no right answers."
                options={FEELINGS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Field label="Note" htmlFor="field-note" optional error={errors.note?.message}>
            <TextArea
              id="field-note"
              placeholder="Anything worth remembering?"
              invalid={Boolean(errors.note)}
              {...register('note')}
            />
          </Field>

          <Field
            label="The story"
            htmlFor="field-story"
            optional
            hint="Who did you meet? What did you learn about the owner or the place?"
            error={errors.story?.message}
          >
            <TextArea
              id="field-story"
              hasHint
              invalid={Boolean(errors.story)}
              {...register('story')}
            />
          </Field>
        </div>
      </details>

      <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-10 -mx-4 space-y-2 bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 md:static md:mx-0 md:bg-transparent md:px-0 md:py-0">
        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-danger-bg px-4 py-3 text-small font-medium text-danger"
          >
            {formError}
          </p>
        )}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save to journal'}
          </Button>
        </div>
      </div>
    </form>
  )
}

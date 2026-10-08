import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ChoiceGroup } from '@/components/ui/ChoiceGroup'
import { Field, TextInput } from '@/components/ui/Field'
import { QueryView } from '@/components/ui/QueryView'
import { Skeleton } from '@/components/ui/Skeleton'
import { Toggle } from '@/components/ui/Toggle'
import { useToast } from '@/components/ui/toast/useToast'
import { useProfile, useUpdateProfile } from '@/hooks/queries'
import { PRICE_TIERS } from '@/lib/constants'
import { profileSchema, type ProfileValues } from '@/lib/schemas'
import type { Profile } from '@/types'

const PRICE_OPTIONS = PRICE_TIERS.map((p) => ({ value: p.value, label: p.label, srHint: p.hint }))

export function ProfilePage() {
  const profile = useProfile()
  return (
    <>
      <PageHeader title="Profile" subtitle="Make the journal yours." />
      <QueryView
        query={profile}
        loading={
          <div className="max-w-content space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        }
        errorTitle="We couldn’t load your profile"
      >
        {(data) => <ProfileForm profile={data} />}
      </QueryView>
    </>
  )
}

function ProfileForm({ profile }: { profile: Profile }) {
  const toast = useToast()
  const update = useUpdateProfile()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile.display_name,
      home_city: profile.preferences.home_city ?? '',
      default_price_tier: profile.preferences.default_price_tier,
      show_health_tags: profile.preferences.show_health_tags,
    },
  })

  const onSubmit = async (values: ProfileValues) => {
    try {
      await update.mutateAsync({
        display_name: values.display_name,
        preferences: {
          home_city: values.home_city.trim() || null,
          default_price_tier: values.default_price_tier,
          show_health_tags: values.show_health_tags,
        },
      })
      reset(values)
      toast.show('Profile saved')
    } catch {
      toast.show('We couldn’t save that. Please try again.')
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="max-w-content space-y-8">
      <section
        aria-labelledby="about-you"
        className="space-y-4 rounded-xl bg-surface p-5 shadow-soft"
      >
        <h2 id="about-you" className="text-h3">
          About you
        </h2>
        <Field label="Name" htmlFor="profile-name" error={errors.display_name?.message}>
          <TextInput
            id="profile-name"
            autoComplete="given-name"
            invalid={Boolean(errors.display_name)}
            {...register('display_name')}
          />
        </Field>
        <Field label="Home city" htmlFor="profile-city" optional>
          <TextInput
            id="profile-city"
            placeholder="e.g. San Francisco"
            {...register('home_city')}
          />
        </Field>
      </section>

      <section aria-labelledby="prefs" className="space-y-6 rounded-xl bg-surface p-5 shadow-soft">
        <h2 id="prefs" className="text-h3">
          Preferences
        </h2>
        <Controller
          control={control}
          name="default_price_tier"
          render={({ field }) => (
            <ChoiceGroup
              legend="Usual price range"
              optional
              clearable
              hint="Just a starting point when you log a meal."
              options={PRICE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="show_health_tags"
          render={({ field }) => (
            <Toggle
              id="profile-tags"
              label="Show tags"
              description="Your own labels like “light” or “comforting”, in the journal and when logging."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      <p className="text-small text-ink-muted">
        Your journal is saved on this device for now. Accounts and syncing come later.
      </p>

      <Button type="submit" size="lg" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}

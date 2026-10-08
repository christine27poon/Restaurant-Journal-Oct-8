import { useState } from 'react'
import { Heart, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PlaceCombobox } from '@/components/place/PlaceCombobox'
import { PlaceCard } from '@/components/place/PlaceCard'
import { Button, LinkButton } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, TextInput } from '@/components/ui/Field'
import { QueryView } from '@/components/ui/QueryView'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toast/useToast'
import {
  useAddToWishlist,
  useCreatePlace,
  usePlaces,
  useRemoveFromWishlist,
  useWishlist,
} from '@/hooks/queries'
import type { PlaceChoice } from '@/lib/schemas'
import type { WishlistEntry } from '@/types'
import { formatVisitDate } from '@/lib/format'

export function WishlistPage() {
  const wishlist = useWishlist()

  return (
    <>
      <PageHeader title="Want to try" subtitle="Places on your radar, no pressure." />
      <AddToWishlist />
      <QueryView
        query={wishlist}
        loading={<WishlistSkeleton />}
        errorTitle="We couldn’t load your list"
        isEmpty={(data) => data.length === 0}
        empty={
          <EmptyState
            icon={Heart}
            title="Nothing here yet"
            description="Add a place you’ve been curious about. It will wait here until you’re ready."
          />
        }
      >
        {(entries) => {
          const wanted = entries.filter((e) => e.status === 'want')
          const visited = entries.filter((e) => e.status === 'visited')
          return (
            <div className="space-y-10">
              <section aria-labelledby="want-heading">
                <h2 id="want-heading" className="mb-4 text-h3">
                  On your list
                </h2>
                {wanted.length === 0 ? (
                  <p className="text-body text-ink-muted">
                    You’ve been to all of them. Nicely done.
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {wanted.map((entry) => (
                      <li key={entry.id}>
                        <WantedCard entry={entry} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              {visited.length > 0 && (
                <section aria-labelledby="visited-heading">
                  <h2 id="visited-heading" className="mb-4 text-h3">
                    Been there
                  </h2>
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {visited.map((entry) => (
                      <li key={entry.id}>
                        <PlaceCard
                          place={entry.place}
                          note={
                            entry.visited_at
                              ? `Visited ${formatVisitDate(entry.visited_at).toLowerCase()}`
                              : null
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )
        }}
      </QueryView>
    </>
  )
}

function WantedCard({ entry }: { entry: WishlistEntry }) {
  const toast = useToast()
  const remove = useRemoveFromWishlist()
  return (
    <PlaceCard
      place={entry.place}
      note={entry.note}
      actions={
        <>
          <LinkButton to={`/log?placeId=${entry.place_id}&wishlistId=${entry.id}`}>
            Mark as visited
          </LinkButton>
          <Button
            variant="ghost"
            disabled={remove.isPending}
            onClick={() =>
              remove.mutate(entry.id, { onSuccess: () => toast.show('Removed from Want to try') })
            }
          >
            <Trash2 aria-hidden className="h-4 w-4" />
            <span className="sr-only">Remove {entry.place.name} from Want to try</span>
            <span aria-hidden>Remove</span>
          </Button>
        </>
      }
    />
  )
}

function AddToWishlist() {
  const toast = useToast()
  const allPlaces = usePlaces('')
  const createPlace = useCreatePlace()
  const add = useAddToWishlist()
  const [choice, setChoice] = useState<PlaceChoice | null>(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  // Bumping the key remounts the combobox so its text clears after adding.
  const [resetKey, setResetKey] = useState(0)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!choice) {
      setError('Choose a place or type its name')
      return
    }
    setError(null)
    try {
      let placeId: string
      if (choice.kind === 'existing') {
        placeId = choice.placeId
      } else {
        const match = allPlaces.data?.find(
          (p) => p.name.toLowerCase() === choice.name.toLowerCase(),
        )
        placeId = match ? match.id : (await createPlace.mutateAsync({ name: choice.name })).id
      }
      await add.mutateAsync({ placeId, note })
      toast.show('Saved to Want to try')
      setChoice(null)
      setNote('')
      setResetKey((k) => k + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We couldn’t add that. Please try again.')
    }
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      className="mb-8 space-y-4 rounded-xl bg-surface p-4 shadow-soft"
    >
      <Field label="Add a place" htmlFor="wish-place" error={error ?? undefined}>
        <PlaceCombobox
          key={resetKey}
          id="wish-place"
          value={choice}
          onChange={(next) => {
            setChoice(next)
            setError(null)
          }}
          invalid={Boolean(error)}
          describedBy={error ? 'wish-place-error' : undefined}
        />
      </Field>
      <Field label="Why does it interest you?" htmlFor="wish-note" optional>
        <TextInput
          id="wish-note"
          value={note}
          maxLength={200}
          placeholder="A friend’s tip or a dish"
          onChange={(event) => setNote(event.target.value)}
        />
      </Field>
      <Button type="submit" disabled={add.isPending || createPlace.isPending}>
        <Plus aria-hidden className="h-5 w-5" />
        Add to Want to try
      </Button>
    </form>
  )
}

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-3 rounded-xl bg-surface p-4 shadow-soft">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-40" />
        </div>
      ))}
    </div>
  )
}

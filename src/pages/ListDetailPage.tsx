import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPinOff, Pencil, Plus, Trash2, X } from 'lucide-react'
import { BackLink } from '@/components/layout/BackLink'
import { ListForm } from '@/components/lists/ListForm'
import { ShareButton } from '@/components/lists/ShareButton'
import { PlaceCard } from '@/components/place/PlaceCard'
import { PlaceCombobox } from '@/components/place/PlaceCombobox'
import { Button, LinkButton } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field } from '@/components/ui/Field'
import { QueryView } from '@/components/ui/QueryView'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toast/useToast'
import {
  useAddPlaceToList,
  useCreatePlace,
  useDeleteList,
  useList,
  usePlaces,
  useRemovePlaceFromList,
  useUpdateList,
} from '@/hooks/queries'
import type { PlaceChoice } from '@/lib/schemas'
import type { PlaceListDetail } from '@/types'

export function ListDetailPage() {
  const { listId } = useParams()
  const list = useList(listId)

  return (
    <>
      <BackLink fallbackTo="/lists" />
      <QueryView
        query={list}
        loading={<ListDetailSkeleton />}
        errorTitle="We couldn’t load this list"
        isEmpty={(data) => data === null}
        empty={
          <EmptyState
            icon={MapPinOff}
            title="We couldn’t find that list"
            description="It may have been deleted."
            action={<LinkButton to="/lists">Back to lists</LinkButton>}
          />
        }
      >
        {(data) => (data ? <ListDetail list={data} /> : null)}
      </QueryView>
    </>
  )
}

function ListDetail({ list }: { list: PlaceListDetail }) {
  const toast = useToast()
  const navigate = useNavigate()
  const updateList = useUpdateList()
  const deleteList = useDeleteList()
  const removePlace = useRemovePlaceFromList()
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h1 md:text-display">{list.name}</h1>
        {list.description && <p className="mt-1 text-body text-ink-muted">{list.description}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <ShareButton listId={list.id} />
          <Button
            variant="secondary"
            onClick={() => {
              setError(null)
              setEditing(true)
            }}
          >
            <Pencil aria-hidden className="h-4 w-4" />
            Rename
          </Button>
          <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
            <Trash2 aria-hidden className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </header>

      <AddPlaceToThisList listId={list.id} existingIds={list.places.map((p) => p.id)} />

      <section aria-labelledby="list-places-heading">
        <h2 id="list-places-heading" className="mb-4 text-h3">
          {list.places.length} {list.places.length === 1 ? 'place' : 'places'}
        </h2>
        {list.places.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="This list is empty"
            description="Search above to add your first place."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {list.places.map((place) => (
              <li key={place.id}>
                <PlaceCard
                  place={place}
                  actions={
                    <Button
                      variant="ghost"
                      disabled={removePlace.isPending}
                      onClick={() =>
                        removePlace.mutate(
                          { listId: list.id, placeId: place.id },
                          { onSuccess: () => toast.show('Removed from list') },
                        )
                      }
                    >
                      <X aria-hidden className="h-4 w-4" />
                      <span className="sr-only">Remove {place.name} from this list</span>
                      <span aria-hidden>Remove</span>
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={editing} onClose={() => setEditing(false)} title="Rename list">
        <ListForm
          initial={{ name: list.name, description: list.description ?? '' }}
          submitLabel="Save"
          error={error}
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            try {
              await updateList.mutateAsync({
                id: list.id,
                patch: { name: values.name, description: values.description },
              })
              setEditing(false)
              toast.show('List updated')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'We couldn’t save that.')
            }
          }}
        />
      </Dialog>

      <Dialog
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        title="Delete this list?"
      >
        <p className="mb-5 text-body text-ink-soft">
          “{list.name}” will be removed. The places themselves stay in your journal.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
            Keep list
          </Button>
          <Button
            variant="danger"
            disabled={deleteList.isPending}
            onClick={() =>
              deleteList.mutate(list.id, {
                onSuccess: () => {
                  toast.show('List deleted')
                  navigate('/lists', { replace: true })
                },
                onError: () => setConfirmingDelete(false),
              })
            }
          >
            Delete list
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

function AddPlaceToThisList({ listId, existingIds }: { listId: string; existingIds: string[] }) {
  const toast = useToast()
  const allPlaces = usePlaces('')
  const createPlace = useCreatePlace()
  const addPlace = useAddPlaceToList()
  const [choice, setChoice] = useState<PlaceChoice | null>(null)
  const [error, setError] = useState<string | null>(null)
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
      if (existingIds.includes(placeId)) {
        setError('That place is already on this list')
        return
      }
      await addPlace.mutateAsync({ listId, placeId })
      toast.show('Added to list')
      setChoice(null)
      setResetKey((k) => k + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We couldn’t add that place.')
    }
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-3 rounded-xl bg-surface p-4 shadow-soft">
      <Field label="Add a place to this list" htmlFor="list-add-place" error={error ?? undefined}>
        <PlaceCombobox
          key={resetKey}
          id="list-add-place"
          value={choice}
          onChange={(next) => {
            setChoice(next)
            setError(null)
          }}
          invalid={Boolean(error)}
          describedBy={error ? 'list-add-place-error' : undefined}
        />
      </Field>
      <Button type="submit" disabled={addPlace.isPending || createPlace.isPending}>
        <Plus aria-hidden className="h-5 w-5" />
        Add place
      </Button>
    </form>
  )
}

function ListDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-12 w-64" />
      <Skeleton className="mt-6 h-32 w-full" />
    </div>
  )
}

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Field, TextInput } from '@/components/ui/Field'
import { QueryView } from '@/components/ui/QueryView'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toast/useToast'
import { useAddPlaceToList, useCreateList, useLists, useRemovePlaceFromList } from '@/hooks/queries'

interface Props {
  open: boolean
  onClose: () => void
  placeId: string
  placeName: string
}

/** Check or uncheck lists for one place, or start a new list right here. */
export function AddPlaceToListDialog({ open, onClose, placeId, placeName }: Props) {
  const toast = useToast()
  const lists = useLists()
  const addPlace = useAddPlaceToList()
  const removePlace = useRemovePlaceFromList()
  const createList = useCreateList()
  const [newName, setNewName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const busy = addPlace.isPending || removePlace.isPending || createList.isPending

  const createAndAdd = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = newName.trim()
    if (!name) {
      setError('Give your list a name')
      return
    }
    setError(null)
    try {
      const list = await createList.mutateAsync({ name })
      await addPlace.mutateAsync({ listId: list.id, placeId })
      setNewName('')
      toast.show(`Added to “${list.name}”`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We couldn’t create that list.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Add ${placeName} to a list`}>
      <QueryView
        query={lists}
        loading={<Skeleton className="h-32 w-full" />}
        errorTitle="We couldn’t load your lists"
        isEmpty={(data) => data.length === 0}
        empty={
          <p className="mb-4 text-body text-ink-muted">
            You don’t have any lists yet. Start one below.
          </p>
        }
      >
        {(data) => (
          <ul className="mb-5 space-y-1">
            {data.map((list) => {
              const included = list.place_ids.includes(placeId)
              const inputId = `add-to-${list.id}`
              return (
                <li key={list.id}>
                  <label
                    htmlFor={inputId}
                    className="flex min-h-touch cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-surface-sunken"
                  >
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={included}
                      disabled={busy}
                      onChange={() =>
                        included
                          ? removePlace.mutate({ listId: list.id, placeId })
                          : addPlace.mutate(
                              { listId: list.id, placeId },
                              { onSuccess: () => toast.show(`Added to “${list.name}”`) },
                            )
                      }
                      className="h-5 w-5 accent-primary-600"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-medium">{list.name}</span>
                      <span className="block text-small text-ink-muted">
                        {list.place_count} {list.place_count === 1 ? 'place' : 'places'}
                      </span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </QueryView>

      <form noValidate onSubmit={createAndAdd} className="space-y-3 border-t border-line pt-4">
        <Field label="Or start a new list" htmlFor="new-list-name" error={error ?? undefined}>
          <TextInput
            id="new-list-name"
            value={newName}
            placeholder="List name"
            invalid={Boolean(error)}
            onChange={(event) => setNewName(event.target.value)}
          />
        </Field>
        <div className="flex justify-between gap-3">
          <Button type="submit" variant="secondary" disabled={busy}>
            <Plus aria-hidden className="h-4 w-4" />
            Create and add
          </Button>
          <Button onClick={onClose}>Done</Button>
        </div>
      </form>
    </Dialog>
  )
}

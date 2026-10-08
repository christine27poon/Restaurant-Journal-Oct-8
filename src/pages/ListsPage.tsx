import { useState } from 'react'
import { ListChecks, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { ListCard } from '@/components/lists/ListCard'
import { ListForm } from '@/components/lists/ListForm'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { QueryView } from '@/components/ui/QueryView'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toast/useToast'
import { useCreateList, useLists } from '@/hooks/queries'

export function ListsPage() {
  const lists = useLists()
  const createList = useCreateList()
  const toast = useToast()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openCreate = () => {
    setError(null)
    setCreating(true)
  }

  return (
    <>
      <PageHeader
        title="Lists"
        subtitle="Collections to keep, share, or come back to."
        action={
          <Button onClick={openCreate}>
            <Plus aria-hidden className="h-5 w-5" />
            New list
          </Button>
        }
      />
      <QueryView
        query={lists}
        loading={<ListsSkeleton />}
        errorTitle="We couldn’t load your lists"
        isEmpty={(data) => data.length === 0}
        empty={
          <EmptyState
            icon={ListChecks}
            title="No lists yet"
            description="Group places any way you like: by neighborhood, mood, or occasion."
            action={<Button onClick={openCreate}>Create your first list</Button>}
          />
        }
      >
        {(data) => (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.map((list) => (
              <li key={list.id}>
                <ListCard list={list} />
              </li>
            ))}
          </ul>
        )}
      </QueryView>

      <Dialog open={creating} onClose={() => setCreating(false)} title="New list">
        <ListForm
          submitLabel="Create list"
          error={error}
          onCancel={() => setCreating(false)}
          onSubmit={async (values) => {
            try {
              const list = await createList.mutateAsync({
                name: values.name,
                description: values.description,
              })
              setCreating(false)
              toast.show('List created')
              navigate(`/lists/${list.id}`)
            } catch (e) {
              setError(e instanceof Error ? e.message : 'We couldn’t create that list.')
            }
          }}
        />
      </Dialog>
    </>
  )
}

function ListsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-3 rounded-xl bg-surface p-4 shadow-soft">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  )
}

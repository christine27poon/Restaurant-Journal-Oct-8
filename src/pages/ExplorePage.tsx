import { useState } from 'react'
import { Search, SearchX } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { MapView } from '@/components/explore/MapView'
import { PlaceCard } from '@/components/place/PlaceCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { QueryView } from '@/components/ui/QueryView'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePlaces } from '@/hooks/queries'

export function ExplorePage() {
  const [search, setSearch] = useState('')
  const places = usePlaces(search.trim())

  return (
    <>
      <PageHeader title="Explore" subtitle="Places around the Bay, ready when you are." />
      <div className="space-y-6">
        <MapView places={places.data ?? []} />

        <div className="relative">
          <label htmlFor="explore-search" className="sr-only">
            Search places
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
          />
          <input
            id="explore-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search places or cuisines"
            className="block min-h-touch w-full rounded-lg border border-line-strong bg-surface pl-11 pr-4 text-body placeholder:text-ink-muted/80"
          />
        </div>

        <QueryView
          query={places}
          loading={<PlacesSkeleton />}
          errorTitle="We couldn’t load places"
          isEmpty={(data) => data.length === 0}
          empty={
            <EmptyState
              icon={SearchX}
              title="No matches"
              description="Try a different word, such as a neighborhood or a type of food."
            />
          }
        >
          {(data) => (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.map((place) => (
                <li key={place.id}>
                  <PlaceCard place={place} />
                </li>
              ))}
            </ul>
          )}
        </QueryView>
      </div>
    </>
  )
}

function PlacesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 rounded-xl bg-surface p-4 shadow-soft">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

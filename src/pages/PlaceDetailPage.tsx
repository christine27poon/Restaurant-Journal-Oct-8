import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ListPlus, MapPin, Plus, SearchX } from 'lucide-react'
import { BackLink } from '@/components/layout/BackLink'
import { Chip } from '@/components/ui/Chip'
import { Button, LinkButton } from '@/components/ui/Button'
import { AddPlaceToListDialog } from '@/components/lists/AddPlaceToListDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { QueryView } from '@/components/ui/QueryView'
import { Skeleton } from '@/components/ui/Skeleton'
import { StoryBlock } from '@/components/place/StoryBlock'
import { WishlistButton } from '@/components/place/WishlistButton'
import { VisitTimeline, VisitTimelineSkeleton } from '@/components/visit/VisitTimeline'
import { usePlace, useProfile, useVisits } from '@/hooks/queries'
import { HEALTH_TAG_LABEL } from '@/lib/constants'
import { placeLocation, priceLabel } from '@/lib/format'
import { tagsFromVisits } from '@/lib/places'
import type { Place } from '@/types'

export function PlaceDetailPage() {
  const { placeId } = useParams()
  const place = usePlace(placeId)

  return (
    <>
      <BackLink fallbackTo="/explore" />
      <QueryView
        query={place}
        loading={<PlaceDetailSkeleton />}
        isEmpty={(data) => data === null}
        empty={
          <EmptyState
            icon={SearchX}
            title="We couldn’t find that place"
            description="It may have been removed. Your other places are still here."
            action={<LinkButton to="/explore">Browse places</LinkButton>}
          />
        }
        errorTitle="We couldn’t load this place"
      >
        {(data) => (data ? <PlaceDetail place={data} /> : null)}
      </QueryView>
    </>
  )
}

function PlaceDetail({ place }: { place: Place }) {
  const visits = useVisits({ placeId: place.id })
  const profile = useProfile()
  const showHealthTags = profile.data?.preferences.show_health_tags ?? true
  const price = priceLabel(place.price_tier)
  const [addingToList, setAddingToList] = useState(false)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-h1 md:text-display">{place.name}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-body text-ink-muted">
          <MapPin aria-hidden className="h-4 w-4 shrink-0" />
          {[placeLocation(place), place.address].filter(Boolean).join(' · ')}
        </p>
        {(place.cuisine || price) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {place.cuisine && <Chip>{place.cuisine}</Chip>}
            {price && (
              <Chip>
                <span className="sr-only">Price: </span>
                {price}
              </Chip>
            )}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton to={`/log?placeId=${place.id}`}>
            <Plus aria-hidden className="h-5 w-5" />
            Log a visit here
          </LinkButton>
          <WishlistButton placeId={place.id} />
          <Button variant="secondary" onClick={() => setAddingToList(true)}>
            <ListPlus aria-hidden className="h-5 w-5" />
            Add to list
          </Button>
        </div>
      </header>

      <QueryView
        query={visits}
        loading={<VisitTimelineSkeleton />}
        errorTitle="We couldn’t load your visits"
      >
        {(data) => {
          const stories = data.filter((v) => v.story)
          const tags = tagsFromVisits(data)
          return (
            <>
              {showHealthTags && tags.length > 0 && (
                <section aria-labelledby="tags-heading">
                  <h2 id="tags-heading" className="mb-3 text-h3">
                    Your tags here
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li key={tag}>
                        <Chip tone="primary">{HEALTH_TAG_LABEL[tag]}</Chip>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {stories.length > 0 && (
                <section aria-labelledby="story-heading" className="space-y-4">
                  <h2 id="story-heading" className="text-h3">
                    The story
                  </h2>
                  {stories.map((visit) => (
                    <StoryBlock
                      key={visit.id}
                      story={visit.story!}
                      visitedAt={visit.visited_at}
                      dishName={visit.dish_name}
                    />
                  ))}
                </section>
              )}

              <section aria-labelledby="visits-heading">
                <h2 id="visits-heading" className="mb-4 text-h3">
                  {data.length === 0
                    ? 'Your visits'
                    : `Your ${data.length === 1 ? 'visit' : `${data.length} visits`}`}
                </h2>
                {data.length === 0 ? (
                  <EmptyState
                    icon={Plus}
                    title="No visits yet"
                    description="When you eat here, log it and it will show up on this page."
                    action={
                      <LinkButton to={`/log?placeId=${place.id}`}>Log a visit here</LinkButton>
                    }
                  />
                ) : (
                  <VisitTimeline visits={data} showHealthTags={showHealthTags} hidePlace />
                )}
              </section>
            </>
          )
        }}
      </QueryView>

      <AddPlaceToListDialog
        open={addingToList}
        onClose={() => setAddingToList(false)}
        placeId={place.id}
        placeName={place.name}
      />
    </div>
  )
}

function PlaceDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-12 w-full max-w-sm" />
      <Skeleton className="mt-6 h-40 w-full" />
    </div>
  )
}

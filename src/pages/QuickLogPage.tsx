import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { QuickLogForm } from '@/components/visit/QuickLogForm'
import { usePlace, useProfile } from '@/hooks/queries'

export function QuickLogPage() {
  const [params] = useSearchParams()
  const placeId = params.get('placeId') ?? undefined
  const wishlistItemId = params.get('wishlistId') ?? undefined

  const place = usePlace(placeId)
  const profile = useProfile()

  const failed = place.isError || profile.isError
  const loading = (placeId ? place.isPending : false) || profile.isPending

  return (
    <>
      <PageHeader
        title="Log a meal"
        subtitle={
          place.data ? `At ${place.data.name}` : 'Place and how it went — that’s all you need.'
        }
      />
      {failed ? (
        <ErrorState
          title="We couldn’t open the form"
          error={place.error ?? profile.error}
          onRetry={() => {
            void place.refetch()
            void profile.refetch()
          }}
        />
      ) : loading || !profile.data ? (
        <div role="status" className="mx-auto max-w-content space-y-6">
          <span className="sr-only">Loading…</span>
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <QuickLogForm
          // Remount if the prefilled place changes (e.g. navigating between wishlist items).
          key={`${placeId ?? 'new'}-${wishlistItemId ?? ''}`}
          initialPlace={place.data}
          wishlistItemId={wishlistItemId}
          showHealthTags={profile.data.preferences.show_health_tags}
          defaultPriceTier={profile.data.preferences.default_price_tier}
        />
      )}
    </>
  )
}

import type { VisitWithPlace } from '@/types'
import { VisitCard } from './VisitCard'
import { Skeleton } from '@/components/ui/Skeleton'

interface VisitTimelineProps {
  visits: VisitWithPlace[]
  showHealthTags?: boolean
  hidePlace?: boolean
}

export function VisitTimeline({ visits, showHealthTags, hidePlace }: VisitTimelineProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {visits.map((visit) => (
        <li key={visit.id}>
          <VisitCard visit={visit} showHealthTags={showHealthTags} hidePlace={hidePlace} />
        </li>
      ))}
    </ul>
  )
}

export function VisitTimelineSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-surface shadow-soft">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

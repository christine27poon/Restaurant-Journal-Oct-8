import { BookOpen, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { LinkButton } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { QueryView } from '@/components/ui/QueryView'
import { VisitTimeline, VisitTimelineSkeleton } from '@/components/visit/VisitTimeline'
import { useProfile, useVisits } from '@/hooks/queries'

export function JournalPage() {
  const visits = useVisits({ limit: 30 })
  const profile = useProfile()
  const showHealthTags = profile.data?.preferences.show_health_tags ?? true
  const name = profile.data?.display_name

  return (
    <>
      <PageHeader
        title={name ? `Hi ${name}` : 'Your journal'}
        documentTitle="Journal"
        subtitle="What did you eat lately?"
        action={
          <LinkButton to="/log" size="lg" className="hidden md:inline-flex">
            <Plus aria-hidden className="h-5 w-5" />
            Log a meal
          </LinkButton>
        }
      />
      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="mb-4 text-h3">
          Recent visits
        </h2>
        <QueryView
          query={visits}
          loading={<VisitTimelineSkeleton />}
          isEmpty={(data) => data.length === 0}
          empty={
            <EmptyState
              icon={BookOpen}
              title="Your journal is waiting for its first bite"
              description="Log a meal in a few taps — just the place and how it went."
              action={
                <LinkButton to="/log">
                  <Plus aria-hidden className="h-5 w-5" />
                  Log a meal
                </LinkButton>
              }
            />
          }
          errorTitle="We couldn’t load your journal"
        >
          {(data) => <VisitTimeline visits={data} showHealthTags={showHealthTags} />}
        </QueryView>
      </section>
    </>
  )
}

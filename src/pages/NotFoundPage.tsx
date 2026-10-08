import { PageHeader } from '@/components/layout/PageHeader'
import { LinkButton } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        title="Page not found"
        subtitle="That page wandered off. Let's get you back to your journal."
      />
      <LinkButton to="/">Back to Journal</LinkButton>
    </>
  )
}

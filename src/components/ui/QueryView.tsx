import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { ErrorState } from './ErrorState'

interface QueryViewProps<T> {
  query: UseQueryResult<T>
  loading: ReactNode
  /** Rendered when `isEmpty(data)` is true. */
  empty?: ReactNode
  isEmpty?: (data: T) => boolean
  errorTitle?: string
  children: (data: T) => ReactNode
}

/** One place that renders the loading / error / empty / data states of a query. */
export function QueryView<T>({
  query,
  loading,
  empty,
  isEmpty,
  errorTitle,
  children,
}: QueryViewProps<T>) {
  if (query.isPending) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading…</span>
        {loading}
      </div>
    )
  }
  if (query.isError) {
    return (
      <ErrorState error={query.error} title={errorTitle} onRetry={() => void query.refetch()} />
    )
  }
  if (isEmpty?.(query.data) && empty) return <>{empty}</>
  return <>{children(query.data)}</>
}

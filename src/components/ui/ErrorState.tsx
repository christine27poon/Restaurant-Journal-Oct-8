import { RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  error?: unknown
  title?: string
  onRetry?: () => void
}

export function ErrorState({ error, title = 'Something didn’t load', onRetry }: ErrorStateProps) {
  const message =
    error instanceof Error && error.name === 'DataError'
      ? error.message
      : 'It’s not you — let’s try that again.'
  return (
    <div
      role="alert"
      className="rounded-xl border border-line-strong bg-surface px-6 py-10 text-center"
    >
      <h2 className="text-h3">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-body text-ink-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          <RefreshCw aria-hidden className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  )
}

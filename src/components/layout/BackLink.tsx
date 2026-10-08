import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

/** Goes back in history when there is some, otherwise to a sensible fallback. */
export function BackLink({
  fallbackTo = '/',
  label = 'Back',
}: {
  fallbackTo?: string
  label?: string
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const canGoBack = location.key !== 'default'

  return (
    <Link
      to={fallbackTo}
      onClick={(event) => {
        if (canGoBack) {
          event.preventDefault()
          navigate(-1)
        }
      }}
      className="-ml-2 mb-3 inline-flex min-h-touch items-center gap-1.5 rounded-lg px-2 text-small font-medium text-ink-muted hover:text-ink"
    >
      <ArrowLeft aria-hidden className="h-4 w-4" />
      {label}
    </Link>
  )
}

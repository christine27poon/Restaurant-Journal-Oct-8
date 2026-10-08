import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/Skeleton'

/** Layout route: signed-in users see the app, everyone else is sent to /login. */
export function RequireAuth() {
  const { status, user, enabled } = useAuth()
  const location = useLocation()

  if (!enabled) return <Outlet />

  if (status === 'loading') {
    return (
      <div role="status" className="mx-auto max-w-content space-y-4 px-4 pt-16">
        <span className="sr-only">Loading…</span>
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return <Outlet />
}

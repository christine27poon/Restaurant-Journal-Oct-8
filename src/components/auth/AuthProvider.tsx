import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDataService } from '@/data/useDataService'
import type { AuthUser } from '@/types'
import { AuthContext, type AuthContextValue } from './AuthContext'

/** Tracks who is signed in and keeps cached data from leaking between accounts. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth } = useDataService()
  const queryClient = useQueryClient()
  const [state, setState] = useState<{ status: 'loading' | 'ready'; user: AuthUser | null }>({
    status: 'loading',
    user: null,
  })

  useEffect(() => {
    let active = true
    let lastUserId: string | null | undefined

    const apply = (user: AuthUser | null) => {
      if (!active) return
      const id = user?.id ?? null
      // Signed in or out as someone different: drop everything cached for the previous user.
      if (lastUserId !== undefined && lastUserId !== id) queryClient.clear()
      lastUserId = id
      setState({ status: 'ready', user })
    }

    void auth.getUser().then(apply)
    const unsubscribe = auth.onChange(apply)
    return () => {
      active = false
      unsubscribe()
    }
  }, [auth, queryClient])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      enabled: auth.enabled,
      signIn: (input) => auth.signIn(input),
      signUp: (input) => auth.signUp(input),
      signOut: () => auth.signOut(),
    }),
    [state, auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

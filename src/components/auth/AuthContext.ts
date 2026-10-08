import { createContext } from 'react'
import type { AuthUser } from '@/types'

export interface AuthContextValue {
  /** 'loading' until the stored session (if any) has been checked. */
  status: 'loading' | 'ready'
  user: AuthUser | null
  /** False for the local mock backend, which has no accounts. */
  enabled: boolean
  signIn: (input: { email: string; password: string }) => Promise<void>
  signUp: (input: {
    email: string
    password: string
    displayName: string
  }) => Promise<{ needsEmailConfirmation: boolean }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

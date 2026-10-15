import type { User } from '@supabase/supabase-js'
import type { AuthService, SignUpInput } from '../repositories'
import { DataError } from '../errors'
import type { AuthUser } from '@/types'
import type { Db } from './client'

const toUser = (user: User | null | undefined): AuthUser | null =>
  user ? { id: user.id, email: user.email ?? null } : null

function authMessage(code: string | undefined, fallback: string): string {
  switch (code) {
    case 'invalid_credentials':
      return 'That email and password don’t match. Please try again.'
    case 'email_not_confirmed':
      return 'Please confirm your email first. Check your inbox for the link.'
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with that email already exists. Try signing in instead.'
    case 'weak_password':
      return 'Please choose a stronger password (at least 8 characters).'
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Too many attempts. Please wait a minute and try again.'
    default:
      return fallback
  }
}

export class SupabaseAuthService implements AuthService {
  readonly enabled = true

  private readonly db: Db

  constructor(db: Db) {
    this.db = db
  }

  async getUser() {
    const { data } = await this.db.auth.getSession()
    return toUser(data.session?.user)
  }

  onChange(listener: (user: AuthUser | null) => void) {
    // Keep this callback synchronous: awaiting Supabase calls inside it can deadlock.
    const { data } = this.db.auth.onAuthStateChange((_event, session) => {
      listener(toUser(session?.user))
    })
    return () => data.subscription.unsubscribe()
  }

  async signUp({ email, password, firstName, lastName, dateOfBirth, city }: SignUpInput) {
    const { data, error } = await this.db.auth.signUp({
      email,
      password,
      options: {
        // Read by the handle_new_user() trigger, which creates the profile row.
        data: {
          display_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          home_city: city,
        },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) {
      throw new DataError(
        'auth',
        authMessage(error.code, 'We couldn’t create your account right now.'),
      )
    }
    // With email confirmation on, signing up an existing address returns a user with no identities.
    if (data.user && data.user.identities?.length === 0) {
      throw new DataError('auth', authMessage('user_already_exists', ''))
    }
    return { needsEmailConfirmation: !data.session }
  }

  async signIn({ email, password }: { email: string; password: string }) {
    const { error } = await this.db.auth.signInWithPassword({ email, password })
    if (error) {
      throw new DataError('auth', authMessage(error.code, 'We couldn’t sign you in right now.'))
    }
  }

  async signOut() {
    const { error } = await this.db.auth.signOut()
    if (error) throw new DataError('auth', 'We couldn’t sign you out. Please try again.')
  }
}

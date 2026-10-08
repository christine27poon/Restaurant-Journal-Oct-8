import type { AuthService } from '../repositories'
import { LOCAL_USER_ID } from './storage'

const LOCAL_USER = { id: LOCAL_USER_ID, email: null }

/** The mock backend has no accounts: everyone is the single local user. */
export class MockAuthService implements AuthService {
  readonly enabled = false

  async getUser() {
    return LOCAL_USER
  }

  onChange() {
    return () => {}
  }

  async signUp() {
    return { needsEmailConfirmation: false }
  }

  async signIn() {}

  async signOut() {}
}

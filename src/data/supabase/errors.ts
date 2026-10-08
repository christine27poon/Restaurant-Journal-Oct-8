import { DataError } from '../errors'

interface SupabaseErrorLike {
  message: string
  code?: string
}

/** Turns a Supabase/PostgREST/Storage error into a DataError with a user-safe message. */
export function toDataError(error: SupabaseErrorLike): DataError {
  if (error.code === 'PGRST116') return new DataError('not_found', 'We couldn’t find that.')
  if (error.code === '42501' || error.code === 'PGRST301' || error.code === '28000') {
    return new DataError('auth', 'Your session has expired. Please sign in again.')
  }
  if (error.message.toLowerCase().includes('exceeded the maximum allowed size')) {
    return new DataError('invalid_photo', 'That photo is too large. Try a smaller one.')
  }
  return new DataError('unknown', 'Something went wrong. Please try again.')
}

type Result = { data: unknown; error: SupabaseErrorLike | null }

/** Returns `data` or throws a DataError (a missing row counts as an error). */
export function unwrap<R extends Result>(result: R): NonNullable<R['data']> {
  if (result.error) throw toDataError(result.error)
  if (result.data === null || result.data === undefined) {
    throw new DataError('not_found', 'We couldn’t find that.')
  }
  return result.data
}

/** Like unwrap, but a missing row is `null` instead of an error. */
export function unwrapMaybe<R extends Result>(result: R): R['data'] {
  if (result.error) throw toDataError(result.error)
  return result.data
}

export function assertOk(result: { error: SupabaseErrorLike | null }): void {
  if (result.error) throw toDataError(result.error)
}

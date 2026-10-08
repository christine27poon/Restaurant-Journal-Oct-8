export type DataErrorCode = 'not_found' | 'storage_full' | 'invalid_photo' | 'unknown'

/** Thrown by any data-layer implementation. Messages are safe to show to the user. */
export class DataError extends Error {
  readonly code: DataErrorCode

  constructor(code: DataErrorCode, message: string) {
    super(message)
    this.name = 'DataError'
    this.code = code
  }
}

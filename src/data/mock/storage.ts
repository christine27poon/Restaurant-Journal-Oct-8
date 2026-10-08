/**
 * The ONLY file in the app that touches localStorage. Keys are versioned so a future
 * shape change can migrate or reset cleanly.
 */
import { DataError } from '../errors'

const PREFIX = 'tablenotes:v1:'

export const LOCAL_USER_ID = '00000000-0000-4000-8000-0000000000aa'

export const delay = (ms = 150) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const newId = () => crypto.randomUUID()
export const nowIso = () => new Date().toISOString()

/** Reads a collection, seeding it on first use (or if the stored JSON is unreadable). */
export function readCollection<T>(name: string, seed: () => T[]): T[] {
  const key = PREFIX + name
  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) return JSON.parse(raw) as T[]
  } catch {
    // Corrupt or unavailable storage: fall through and reseed.
  }
  const initial = seed()
  writeCollection(name, initial)
  return initial
}

export function writeCollection<T>(name: string, items: T[]): void {
  write(name, items)
}

function write(name: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(value))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new DataError(
        'storage_full',
        'Your browser is out of room to save this. Try a smaller photo or remove an older visit.',
      )
    }
    throw new DataError('unknown', 'Something went wrong with your saved data. Please try again.')
  }
}

export function readValue<T>(name: string, seed: () => T): T {
  const key = PREFIX + name
  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) return JSON.parse(raw) as T
  } catch {
    // fall through and reseed
  }
  const initial = seed()
  writeValue(name, initial)
  return initial
}

export function writeValue<T>(name: string, value: T): void {
  write(name, value)
}

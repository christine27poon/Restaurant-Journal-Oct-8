/**
 * The single swap point. With VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set the app talks
 * to Supabase; without them it falls back to the localStorage mock (handy offline / for demos).
 */
import { createMockDataService } from './mock'
import { createSupabaseDataService } from './supabase'
import type { DataService } from './repositories'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const dataBackend: 'supabase' | 'mock' = url && anonKey ? 'supabase' : 'mock'

export const dataService: DataService =
  url && anonKey ? createSupabaseDataService(url, anonKey) : createMockDataService()

export { DataProvider } from './DataProvider'
export { DataError } from './errors'
export type * from './repositories'

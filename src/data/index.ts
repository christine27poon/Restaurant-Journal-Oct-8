/**
 * The single swap point. To move to Supabase: implement DataService in src/data/supabase
 * and export it here instead of the mock.
 */
import { createMockDataService } from './mock'
import type { DataService } from './repositories'

export const dataService: DataService = createMockDataService()

export { DataProvider } from './DataProvider'
export { DataError } from './errors'
export type * from './repositories'

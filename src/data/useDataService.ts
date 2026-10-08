import { useContext } from 'react'
import { DataContext } from './DataContext'
import type { DataService } from './repositories'

/** Only the hooks in src/hooks/queries should call this. */
export function useDataService(): DataService {
  const service = useContext(DataContext)
  if (!service) throw new Error('useDataService must be used inside <DataProvider>')
  return service
}

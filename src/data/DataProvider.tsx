import type { ReactNode } from 'react'
import { DataContext } from './DataContext'
import type { DataService } from './repositories'

export function DataProvider({ service, children }: { service: DataService; children: ReactNode }) {
  return <DataContext.Provider value={service}>{children}</DataContext.Provider>
}

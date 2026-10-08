import { createContext } from 'react'
import type { DataService } from './repositories'

export const DataContext = createContext<DataService | null>(null)

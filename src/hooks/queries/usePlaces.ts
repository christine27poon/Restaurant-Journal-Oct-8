import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataService } from '@/data/useDataService'
import type { NewPlace } from '@/types'
import { queryKeys } from './queryKeys'

export function usePlaces(search = '') {
  const { places } = useDataService()
  return useQuery({
    queryKey: queryKeys.places.list(search),
    queryFn: () => places.list({ search }),
    placeholderData: keepPreviousData,
  })
}

export function usePlace(id: string | undefined) {
  const { places } = useDataService()
  return useQuery({
    queryKey: queryKeys.places.detail(id ?? ''),
    queryFn: () => places.get(id!),
    enabled: Boolean(id),
  })
}

export function useCreatePlace() {
  const { places } = useDataService()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewPlace) => places.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.places.all }),
  })
}

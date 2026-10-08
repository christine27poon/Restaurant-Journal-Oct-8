import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataService } from '@/data/useDataService'
import type { NewVisit } from '@/types'
import { queryKeys } from './queryKeys'

export function useVisits(options?: { placeId?: string; limit?: number }) {
  const { visits } = useDataService()
  return useQuery({
    queryKey: queryKeys.visits.list(options?.placeId, options?.limit),
    queryFn: () => visits.list(options),
  })
}

interface CreateVisitInput {
  visit: NewVisit
  /** When logging from the wishlist, that item is marked visited too. */
  wishlistItemId?: string
}

export function useCreateVisit() {
  const { visits, wishlist } = useDataService()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ visit, wishlistItemId }: CreateVisitInput) => {
      const created = await visits.create(visit)
      if (wishlistItemId) await wishlist.markVisited(wishlistItemId)
      return created
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.visits.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all }),
      ]),
  })
}

export function useDeleteVisit() {
  const { visits } = useDataService()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => visits.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.visits.all }),
  })
}

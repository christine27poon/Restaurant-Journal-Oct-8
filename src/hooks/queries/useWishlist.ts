import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataService } from '@/data/useDataService'
import { queryKeys } from './queryKeys'

export function useWishlist() {
  const { wishlist } = useDataService()
  return useQuery({ queryKey: queryKeys.wishlist.all, queryFn: () => wishlist.list() })
}

export function useAddToWishlist() {
  const { wishlist } = useDataService()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ placeId, note }: { placeId: string; note?: string | null }) =>
      wishlist.add(placeId, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all }),
  })
}

export function useRemoveFromWishlist() {
  const { wishlist } = useDataService()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => wishlist.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all }),
  })
}

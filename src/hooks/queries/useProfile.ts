import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataService } from '@/data/useDataService'
import type { ProfilePatch } from '@/types'
import { queryKeys } from './queryKeys'

export function useProfile() {
  const { profile } = useDataService()
  return useQuery({ queryKey: queryKeys.profile.all, queryFn: () => profile.get() })
}

export function useUpdateProfile() {
  const { profile } = useDataService()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: ProfilePatch) => profile.update(patch),
    onSuccess: (updated) => queryClient.setQueryData(queryKeys.profile.all, updated),
  })
}

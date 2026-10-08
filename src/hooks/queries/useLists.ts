import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataService } from '@/data/useDataService'
import type { NewPlaceList, PlaceListPatch } from '@/types'
import { queryKeys } from './queryKeys'

export function useLists() {
  const { lists } = useDataService()
  return useQuery({ queryKey: queryKeys.lists.index, queryFn: () => lists.list() })
}

export function useList(id: string | undefined) {
  const { lists } = useDataService()
  return useQuery({
    queryKey: queryKeys.lists.detail(id ?? ''),
    queryFn: () => lists.get(id!),
    enabled: Boolean(id),
  })
}

function useListMutation<TInput, TOutput>(run: (input: TInput) => Promise<TOutput>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: run,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.lists.all }),
  })
}

export function useCreateList() {
  const { lists } = useDataService()
  return useListMutation((input: NewPlaceList) => lists.create(input))
}

export function useUpdateList() {
  const { lists } = useDataService()
  return useListMutation(({ id, patch }: { id: string; patch: PlaceListPatch }) =>
    lists.update(id, patch),
  )
}

export function useDeleteList() {
  const { lists } = useDataService()
  return useListMutation((id: string) => lists.remove(id))
}

export function useAddPlaceToList() {
  const { lists } = useDataService()
  return useListMutation(({ listId, placeId }: { listId: string; placeId: string }) =>
    lists.addPlace(listId, placeId),
  )
}

export function useRemovePlaceFromList() {
  const { lists } = useDataService()
  return useListMutation(({ listId, placeId }: { listId: string; placeId: string }) =>
    lists.removePlace(listId, placeId),
  )
}

export function useShareList() {
  const { lists } = useDataService()
  return useMutation({ mutationFn: (id: string) => lists.getShareUrl(id) })
}

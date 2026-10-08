import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDataService } from '@/data/useDataService'

/** Fills an empty journal with sample entries, then refreshes everything on screen. */
export function useLoadSampleData() {
  const { samples } = useDataService()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => samples.load(),
    onSuccess: () => queryClient.invalidateQueries(),
  })
}

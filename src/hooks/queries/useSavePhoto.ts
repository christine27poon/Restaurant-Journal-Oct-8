import { useMutation } from '@tanstack/react-query'
import { useDataService } from '@/data/useDataService'

export function useSavePhoto() {
  const { photos } = useDataService()
  return useMutation({ mutationFn: (file: File) => photos.save(file) })
}

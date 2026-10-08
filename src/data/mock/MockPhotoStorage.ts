import type { PhotoStorage } from '../repositories'
import { DataError } from '../errors'

const MAX_EDGE = 1024
const QUALITY = 0.8

/**
 * Stores photos as small JPEG data URLs so they survive a reload (object URLs don't).
 * A Supabase implementation would upload to Storage and return its public URL instead.
 */
export class MockPhotoStorage implements PhotoStorage {
  async save(file: File) {
    if (!file.type.startsWith('image/')) {
      throw new DataError('invalid_photo', 'That file doesn’t look like a photo.')
    }
    try {
      const bitmap = await createImageBitmap(file)
      const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(bitmap.width * scale)
      canvas.height = Math.round(bitmap.height * scale)
      const context = canvas.getContext('2d')
      if (!context) throw new Error('no canvas context')
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      bitmap.close()
      return canvas.toDataURL('image/jpeg', QUALITY)
    } catch {
      throw new DataError('invalid_photo', 'We couldn’t read that photo. Try a different one.')
    }
  }
}

import type { PhotoStorage } from '../repositories'
import { resizeToJpeg } from '../image'
import { DataError } from '../errors'

/**
 * Stores photos as small JPEG data URLs so they survive a reload (object URLs don't).
 * The Supabase implementation uploads to Storage instead.
 */
export class MockPhotoStorage implements PhotoStorage {
  async save(file: File) {
    const blob = await resizeToJpeg(file)
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () =>
        reject(new DataError('invalid_photo', 'We couldn’t read that photo. Try a different one.'))
      reader.readAsDataURL(blob)
    })
  }
}

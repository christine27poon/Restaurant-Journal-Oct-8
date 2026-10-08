import type { PhotoStorage } from '../repositories'
import { DataError } from '../errors'
import { resizeToJpeg } from '../image'
import type { Db } from './client'
import { toDataError } from './errors'
import { PHOTO_BUCKET } from './photos'

/** Uploads to the private `visit-photos` bucket, in a folder named after the user's id. */
export class SupabasePhotoStorage implements PhotoStorage {
  private readonly db: Db

  constructor(db: Db) {
    this.db = db
  }

  async save(file: File) {
    const blob = await resizeToJpeg(file)
    const { data } = await this.db.auth.getSession()
    const userId = data.session?.user.id
    if (!userId) throw new DataError('auth', 'Please sign in to add photos.')

    const path = `${userId}/${crypto.randomUUID()}.jpg`
    const { error } = await this.db.storage
      .from(PHOTO_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg' })
    if (error) throw toDataError(error)
    // The path is stored on the visit; repositories turn it into a signed URL when reading.
    return path
  }
}

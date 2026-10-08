import type { Db } from './client'

export const PHOTO_BUCKET = 'visit-photos'
const SIGNED_URL_SECONDS = 60 * 60 * 6

/**
 * `photo_url` holds either a ready-to-use URL (bundled sample images start with "/") or the
 * path of an object in the private storage bucket, which must be signed before display.
 */
const isStoragePath = (value: string | null): value is string =>
  Boolean(value) && !/^(https?:|data:|\/)/.test(value!)

export async function withSignedPhotoUrls<T extends { photo_url: string | null }>(
  db: Db,
  rows: T[],
): Promise<T[]> {
  const paths = [...new Set(rows.map((row) => row.photo_url).filter(isStoragePath))]
  if (paths.length === 0) return rows

  const { data } = await db.storage.from(PHOTO_BUCKET).createSignedUrls(paths, SIGNED_URL_SECONDS)
  const signed = new Map(
    (data ?? []).flatMap((entry) =>
      entry.path && entry.signedUrl ? [[entry.path, entry.signedUrl]] : [],
    ),
  )
  return rows.map((row) =>
    isStoragePath(row.photo_url) ? { ...row, photo_url: signed.get(row.photo_url) ?? null } : row,
  )
}

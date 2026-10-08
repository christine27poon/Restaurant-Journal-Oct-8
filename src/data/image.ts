import { DataError } from './errors'

const MAX_EDGE = 1024
const QUALITY = 0.8

/** Shrinks a photo to a ~1024px JPEG so it's small enough to store and fast to load. */
export async function resizeToJpeg(file: File): Promise<Blob> {
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
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY),
    )
    if (!blob) throw new Error('encode failed')
    return blob
  } catch {
    throw new DataError('invalid_photo', 'We couldn’t read that photo. Try a different one.')
  }
}

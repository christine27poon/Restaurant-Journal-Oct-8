import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PhotoPickerProps {
  id: string
  onChange: (file: File | null) => void
}

/** Local file picker with an object-URL preview. The saved URL comes from the data layer. */
export function PhotoPicker({ id, onChange }: PhotoPickerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const urlRef = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Revoke the last object URL when the component goes away.
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )

  const setFile = (file: File | null) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = file ? URL.createObjectURL(file) : null
    setPreviewUrl(urlRef.current)
    onChange(file)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null)
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl bg-surface-sunken">
          <img
            src={previewUrl}
            alt="Preview of the photo you chose"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="absolute right-3 top-3">
            <Button
              variant="secondary"
              aria-label="Remove photo"
              onClick={() => {
                setFile(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
            >
              <X aria-hidden className="h-5 w-5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-surface text-center text-ink-soft transition-colors hover:bg-surface-sunken has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-600"
        >
          <span
            aria-hidden
            className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary-700"
          >
            <Camera className="h-6 w-6" />
          </span>
          <span className="text-body font-medium">Add a photo</span>
          <span className="text-small text-ink-muted">Optional — from your camera or library</span>
        </label>
      )}
    </div>
  )
}

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Modal built on the native <dialog>: focus is trapped, Escape closes, and the page behind
 * is inert. Bottom sheet on phones, centered card from sm up. Children mount only while open
 * so forms start fresh each time.
 */
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // Children mount in the same commit, so the preferred field exists by now.
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Click on the backdrop (the dialog element itself) dismisses.
        if (event.target === ref.current) onClose()
      }}
      className="m-auto w-full max-w-md rounded-xl bg-surface p-0 text-ink shadow-lift backdrop:bg-ink/40 max-sm:mb-0 max-sm:max-w-none max-sm:rounded-b-none"
    >
      {open && (
        <div className="max-h-[85vh] overflow-y-auto p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 id={titleId} className="text-h3">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-1 grid min-h-touch min-w-touch place-items-center rounded-full text-ink-muted hover:bg-surface-sunken"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}

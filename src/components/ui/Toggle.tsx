import { cn } from '@/lib/cn'

interface ToggleProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/** A labeled on/off switch (role="switch"). */
export function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex min-h-touch items-center justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-body font-medium text-ink">
          {label}
        </label>
        {description && <p className="text-small text-ink-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors',
          checked ? 'border-sage-700 bg-sage-700' : 'border-line-strong bg-surface-sunken',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'inline-block h-6 w-6 rounded-full bg-white shadow-soft transition-transform',
            checked ? 'translate-x-7' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  )
}

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface FieldProps {
  label: string
  htmlFor: string
  optional?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

/** Visible label + hint + error wrapper. Pair it with TextInput/TextArea using the same id. */
export function Field({ label, htmlFor, optional, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-small font-medium text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={`${htmlFor}-hint`} className="text-small text-ink-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-small font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const inputBase =
  'block w-full rounded-lg border bg-surface px-4 text-body text-ink placeholder:text-ink-muted/80 transition-colors focus-visible:outline-primary-600 disabled:opacity-60'

type DescribedProps = { id: string; hasHint?: boolean; invalid?: boolean }

function describedBy({ id, hasHint, invalid }: DescribedProps) {
  const ids = [hasHint && `${id}-hint`, invalid && `${id}-error`].filter(Boolean).join(' ')
  return ids || undefined
}

export function TextInput({
  id,
  hasHint,
  invalid,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & DescribedProps) {
  return (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy({ id, hasHint, invalid })}
      className={cn(
        inputBase,
        'min-h-touch',
        invalid ? 'border-danger' : 'border-line-strong',
        className,
      )}
      {...rest}
    />
  )
}

export function TextArea({
  id,
  hasHint,
  invalid,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & DescribedProps) {
  return (
    <textarea
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy({ id, hasHint, invalid })}
      className={cn(
        inputBase,
        'min-h-24 py-3',
        invalid ? 'border-danger' : 'border-line-strong',
        className,
      )}
      {...rest}
    />
  )
}

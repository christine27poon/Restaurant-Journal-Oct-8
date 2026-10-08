import { useId } from 'react'
import { cn } from '@/lib/cn'
import { chipToneClasses, type ChipTone } from '@/lib/chipTones'

export interface ChoiceOption<T extends string | number> {
  value: T
  label: string
  /** Extra text for screen readers only (e.g. price range). */
  srHint?: string
  tone?: ChipTone
}

interface BaseProps<T extends string | number> {
  legend: string
  options: ReadonlyArray<ChoiceOption<T>>
  optional?: boolean
  hint?: string
  error?: string
  /** Larger, full-width chips (used for the rating). */
  large?: boolean
}

interface SingleProps<T extends string | number> extends BaseProps<T> {
  multiple?: false
  value: T | null
  onChange: (value: T | null) => void
  /** Selecting the active option again clears it (for optional single choices). */
  clearable?: boolean
}

interface MultiProps<T extends string | number> extends BaseProps<T> {
  multiple: true
  value: T[]
  onChange: (value: T[]) => void
}

/**
 * Accessible selectable chips built on native radio / checkbox inputs inside a fieldset,
 * so keyboard, screen readers and focus all behave natively.
 */
export function ChoiceGroup<T extends string | number>(props: SingleProps<T> | MultiProps<T>) {
  const { legend, options, optional, hint, error, large } = props
  const name = useId()
  const hintId = `${name}-hint`
  const errorId = `${name}-error`

  const isSelected = (value: T) =>
    props.multiple ? props.value.includes(value) : props.value === value

  return (
    <fieldset
      aria-describedby={[hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-1.5 text-small font-medium text-ink">
        {legend}
        {optional && <span className="ml-1 font-normal text-ink-muted">(optional)</span>}
      </legend>
      {hint && (
        <p id={hintId} className="mb-2 text-small text-ink-muted">
          {hint}
        </p>
      )}
      <div className={cn('flex flex-wrap gap-2', large && 'grid grid-cols-1 sm:grid-cols-3')}>
        {options.map((option) => {
          const selected = isSelected(option.value)
          const inputId = `${name}-${option.value}`
          return (
            <div key={option.value} className="relative">
              <input
                id={inputId}
                type={props.multiple ? 'checkbox' : 'radio'}
                name={name}
                checked={selected}
                className="peer sr-only"
                onChange={() => {
                  if (props.multiple) {
                    props.onChange(
                      selected
                        ? props.value.filter((v) => v !== option.value)
                        : [...props.value, option.value],
                    )
                  } else {
                    props.onChange(option.value)
                  }
                }}
                onClick={() => {
                  // Radios don't fire change when re-clicked; allow clearing optional choices.
                  if (!props.multiple && props.clearable && selected) props.onChange(null)
                }}
              />
              <label
                htmlFor={inputId}
                className={cn(
                  'flex min-h-touch min-w-touch cursor-pointer select-none items-center justify-center rounded-full border px-4 text-body font-medium transition-colors',
                  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-600',
                  large && 'w-full sm:min-h-[3.25rem]',
                  selected
                    ? cn(chipToneClasses[option.tone ?? 'primary'], 'border-current')
                    : 'border-line-strong bg-surface text-ink-soft hover:bg-surface-sunken',
                )}
              >
                {option.label}
                {option.srHint && <span className="sr-only"> ({option.srHint})</span>}
              </label>
            </div>
          )
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-small font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}

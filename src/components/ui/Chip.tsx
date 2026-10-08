import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { chipToneClasses, type ChipTone } from '@/lib/chipTones'

/** Read-only label pill. For selectable chips see ChoiceGroup. */
export function Chip({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: ChipTone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-medium',
        chipToneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

import { cn } from '@/lib/cn'

/** Decorative loading placeholder. Pair with a visually-hidden status in the parent. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-lg bg-surface-sunken', className)} />
}

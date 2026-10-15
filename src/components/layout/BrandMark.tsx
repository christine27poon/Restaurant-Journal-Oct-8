import noodleBowl from '@/assets/noodle-bowl-icon.svg'
import { cn } from '@/lib/cn'

interface BrandMarkProps {
  /** 48 for page headers, 32 for the sidebar. */
  size?: 32 | 48
  className?: string
}

/** The app icon: a white noodle bowl on a terracotta rounded square. Decorative. */
export function BrandMark({ size = 48, className }: BrandMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'block shrink-0 overflow-hidden bg-primary-600',
        size === 48 ? 'h-12 w-12 rounded-xl' : 'h-8 w-8 rounded-md',
        className,
      )}
    >
      <img src={noodleBowl} alt="" className="block h-full w-full max-w-none" />
    </span>
  )
}

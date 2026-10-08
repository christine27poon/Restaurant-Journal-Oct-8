import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/lib/nav'
import { cn } from '@/lib/cn'

/** Mobile navigation. Hidden from md up, where SideNav takes over. */
export function BottomTabBar() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-safe backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex h-tabbar max-w-content items-stretch justify-around px-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex h-full min-h-touch flex-col items-center justify-center gap-0.5 rounded-lg text-caption font-medium transition-colors',
                  isActive ? 'text-primary-700' : 'text-ink-muted hover:text-ink',
                )
              }
            >
              <Icon aria-hidden className="h-6 w-6" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

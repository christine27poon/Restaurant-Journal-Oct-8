import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/nav'
import { cn } from '@/lib/cn'
import { LinkButton } from '@/components/ui/Button'

/** Desktop/tablet navigation. Hidden below md, where BottomTabBar takes over. */
export function SideNav() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-sidebar flex-col border-r border-line bg-surface px-4 py-6 md:flex">
      <NavLink
        to="/"
        className="mb-8 flex items-center gap-2 px-2 font-display text-h3 font-semibold"
      >
        <span
          aria-hidden
          className="grid h-8 w-8 place-items-center rounded-md bg-primary-600 text-white"
        >
          <span className="h-3 w-3 rounded-full border-2 border-white" />
        </span>
        Table Notes
      </NavLink>
      <LinkButton to="/log" className="mb-6 w-full">
        <Plus aria-hidden className="h-5 w-5" />
        Log a meal
      </LinkButton>
      <nav aria-label="Main">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-touch items-center gap-3 rounded-lg px-3 text-body font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-ink-soft hover:bg-surface-sunken hover:text-ink',
                  )
                }
              >
                <Icon aria-hidden className="h-5 w-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

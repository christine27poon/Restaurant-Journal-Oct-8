import { BookOpen, Compass, Heart, ListChecks, User, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Journal', icon: BookOpen, end: true },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/wishlist', label: 'Want to try', icon: Heart },
  { to: '/lists', label: 'Lists', icon: ListChecks },
  { to: '/profile', label: 'Profile', icon: User },
]

import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { BottomTabBar } from './BottomTabBar'
import { SideNav } from './SideNav'
import { LinkButton } from '@/components/ui/Button'

export function AppShell() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  // After navigating, move focus to the content so screen-reader and keyboard users start there.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lift"
      >
        Skip to content
      </a>
      <ScrollRestoration />
      <SideNav />
      <div className="md:pl-sidebar">
        <main
          ref={mainRef}
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-wide outline-none px-4 pb-40 pt-[calc(1.5rem+env(safe-area-inset-top))] sm:px-6 md:pb-16 md:pt-10"
        >
          <Outlet />
        </main>
      </div>
      {/* Mobile floating action: sits above the tab bar. */}
      {pathname !== '/log' && (
        <LinkButton
          to="/log"
          size="lg"
          className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] right-4 z-20 shadow-lift md:hidden"
        >
          <Plus aria-hidden className="h-5 w-5" />
          Log a meal
        </LinkButton>
      )}
      <BottomTabBar />
    </div>
  )
}

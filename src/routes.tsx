import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { AppShell } from '@/components/layout/AppShell'
import { AuthPage } from '@/pages/AuthPage'
import { JournalPage } from '@/pages/JournalPage'
import { QuickLogPage } from '@/pages/QuickLogPage'
import { PlaceDetailPage } from '@/pages/PlaceDetailPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { ListsPage } from '@/pages/ListsPage'
import { ListDetailPage } from '@/pages/ListDetailPage'
import { ExplorePage } from '@/pages/ExplorePage'
import { ProfilePage } from '@/pages/ProfilePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/login', element: <AuthPage mode="signin" /> },
  { path: '/signup', element: <AuthPage mode="signup" /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <JournalPage /> },
          { path: '/log', element: <QuickLogPage /> },
          { path: '/places/:placeId', element: <PlaceDetailPage /> },
          { path: '/wishlist', element: <WishlistPage /> },
          { path: '/lists', element: <ListsPage /> },
          { path: '/lists/:listId', element: <ListDetailPage /> },
          { path: '/explore', element: <ExplorePage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])

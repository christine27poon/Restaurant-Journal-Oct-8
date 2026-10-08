/**
 * THE data-layer contract. Components never see implementations — they use the hooks in
 * src/hooks/queries, which get a DataService from context. To adopt Supabase, add
 * src/data/supabase/* implementing these interfaces and change the export in src/data/index.ts.
 *
 * Every method is async and may reject with a DataError.
 */
import type {
  AuthUser,
  NewPlace,
  NewPlaceList,
  NewVisit,
  Place,
  PlaceList,
  PlaceListDetail,
  PlaceListPatch,
  PlaceListSummary,
  Profile,
  ProfilePatch,
  Visit,
  VisitPatch,
  VisitWithPlace,
  WishlistEntry,
  WishlistItem,
} from '@/types'

export interface PlaceRepository {
  list(query?: { search?: string }): Promise<Place[]>
  get(id: string): Promise<Place | null>
  create(input: NewPlace): Promise<Place>
}

export interface VisitRepository {
  /** Newest first. */
  list(query?: { placeId?: string; limit?: number }): Promise<VisitWithPlace[]>
  get(id: string): Promise<VisitWithPlace | null>
  create(input: NewVisit): Promise<Visit>
  update(id: string, patch: VisitPatch): Promise<Visit>
  remove(id: string): Promise<void>
}

export interface WishlistRepository {
  /** Newest first. */
  list(): Promise<WishlistEntry[]>
  /** Idempotent: returns the existing "want" item if the place is already saved. */
  add(placeId: string, note?: string | null): Promise<WishlistItem>
  remove(id: string): Promise<void>
  markVisited(id: string): Promise<WishlistItem>
}

export interface ListRepository {
  list(): Promise<PlaceListSummary[]>
  get(id: string): Promise<PlaceListDetail | null>
  create(input: NewPlaceList): Promise<PlaceList>
  update(id: string, patch: PlaceListPatch): Promise<PlaceList>
  remove(id: string): Promise<void>
  addPlace(listId: string, placeId: string): Promise<void>
  removePlace(listId: string, placeId: string): Promise<void>
  /** Mock returns a placeholder URL; Supabase will return a real shareable link. */
  getShareUrl(id: string): Promise<string>
}

export interface ProfileRepository {
  get(): Promise<Profile>
  update(patch: ProfilePatch): Promise<Profile>
}

export interface PhotoStorage {
  /** Persists a photo and returns a URL that can be stored on a Visit. */
  save(file: File): Promise<string>
}

export interface SignUpInput {
  email: string
  password: string
  displayName: string
}

export interface AuthService {
  /**
   * False when the backend has no accounts (the local mock). The app then skips login
   * screens and sign-out.
   */
  readonly enabled: boolean
  getUser(): Promise<AuthUser | null>
  /** Subscribes to sign-in / sign-out. Returns an unsubscribe function. */
  onChange(listener: (user: AuthUser | null) => void): () => void
  /** `needsEmailConfirmation` is true when the user must click an emailed link first. */
  signUp(input: SignUpInput): Promise<{ needsEmailConfirmation: boolean }>
  signIn(input: { email: string; password: string }): Promise<void>
  signOut(): Promise<void>
}

export interface SampleDataService {
  /** Fills an empty journal with sample visits, wishlist items and lists. No-op if not empty. */
  load(): Promise<void>
}

export interface DataService {
  auth: AuthService
  places: PlaceRepository
  visits: VisitRepository
  wishlist: WishlistRepository
  lists: ListRepository
  profile: ProfileRepository
  photos: PhotoStorage
  samples: SampleDataService
}

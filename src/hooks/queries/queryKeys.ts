export const queryKeys = {
  places: {
    all: ['places'] as const,
    list: (search = '') => ['places', 'list', search] as const,
    detail: (id: string) => ['places', 'detail', id] as const,
  },
  visits: {
    all: ['visits'] as const,
    list: (placeId?: string, limit?: number) =>
      ['visits', 'list', placeId ?? null, limit ?? null] as const,
  },
  wishlist: { all: ['wishlist'] as const },
  lists: {
    all: ['lists'] as const,
    index: ['lists', 'index'] as const,
    detail: (id: string) => ['lists', 'detail', id] as const,
  },
  profile: { all: ['profile'] as const },
}

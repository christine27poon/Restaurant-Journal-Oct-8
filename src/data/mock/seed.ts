/**
 * Sample data so every screen looks populated. All restaurant names, people, and stories
 * below are fictional; neighborhoods and cities are real Bay Area locations.
 */
import type { Place, PlaceList, PlaceListItem, Profile, Visit, WishlistItem } from '@/types'
import { LOCAL_USER_ID } from './storage'

const id = (kind: string, n: number) =>
  `${kind}000000-0000-4000-8000-${String(n).padStart(12, '0')}`

export const placeId = (n: number) => id('0a', n)
const visitId = (n: number) => id('0b', n)
const wishId = (n: number) => id('0c', n)
const listId = (n: number) => id('0d', n)
const listItemId = (n: number) => id('0e', n)

const daysAgo = (days: number, hour = 12) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

const SEED_CREATED = daysAgo(60)

type PlaceSeed = Omit<Place, 'id' | 'source' | 'created_at'>
const placeSeeds: PlaceSeed[] = [
  {
    name: 'Fig & Fennel Kitchen',
    neighborhood: 'Downtown',
    city: 'Palo Alto',
    address: '412 University Ave',
    cuisine: 'Mediterranean',
    price_tier: 3,
    lat: 37.4443,
    lng: -122.1598,
  },
  {
    name: 'Sunday Noodle House',
    neighborhood: 'Inner Sunset',
    city: 'San Francisco',
    address: '1340 9th Ave',
    cuisine: 'Taiwanese',
    price_tier: 2,
    lat: 37.7648,
    lng: -122.4663,
  },
  {
    name: 'Tidewater Poke',
    neighborhood: 'Park Street',
    city: 'Alameda',
    address: '1520 Park St',
    cuisine: 'Hawaiian',
    price_tier: 2,
    lat: 37.7653,
    lng: -122.2416,
  },
  {
    name: 'La Milpa Cocina',
    neighborhood: 'Mission District',
    city: 'San Francisco',
    address: '2918 24th St',
    cuisine: 'Oaxacan',
    price_tier: 2,
    lat: 37.7527,
    lng: -122.4141,
  },
  {
    name: 'The Green Ladle',
    neighborhood: 'Temescal',
    city: 'Oakland',
    address: '4931 Telegraph Ave',
    cuisine: 'Soups & bowls',
    price_tier: 2,
    lat: 37.8341,
    lng: -122.2638,
  },
  {
    name: 'Little Bear Bakery',
    neighborhood: 'Castro Street',
    city: 'Mountain View',
    address: '780 Castro St',
    cuisine: 'Bakery & café',
    price_tier: 1,
    lat: 37.3943,
    lng: -122.0795,
  },
  {
    name: 'Saffron & Sage',
    neighborhood: 'Gourmet Ghetto',
    city: 'Berkeley',
    address: '1604 Shattuck Ave',
    cuisine: 'Persian',
    price_tier: 3,
    lat: 37.8795,
    lng: -122.2693,
  },
  {
    name: 'Pier Nine Oyster Bar',
    neighborhood: 'Harbor',
    city: 'Half Moon Bay',
    address: '9 Johnson Pier',
    cuisine: 'Seafood',
    price_tier: 4,
    lat: 37.5021,
    lng: -122.4829,
  },
  {
    name: 'Hearth & Hill',
    neighborhood: 'Downtown',
    city: 'Los Gatos',
    address: '55 N Santa Cruz Ave',
    cuisine: 'Wood-fired Italian',
    price_tier: 3,
    lat: 37.2266,
    lng: -121.9836,
  },
  {
    name: 'Corner Bánh Mì',
    neighborhood: 'Willow Glen',
    city: 'San Jose',
    address: '1190 Lincoln Ave',
    cuisine: 'Vietnamese',
    price_tier: 1,
    lat: 37.3039,
    lng: -121.9007,
  },
  {
    name: 'Orchard Table',
    neighborhood: 'Downtown',
    city: 'Mill Valley',
    address: '38 Throckmorton Ave',
    cuisine: 'Californian',
    price_tier: 4,
    lat: 37.906,
    lng: -122.545,
  },
  {
    name: 'Daybreak Dumplings',
    neighborhood: 'Downtown',
    city: 'Redwood City',
    address: '2210 Broadway',
    cuisine: 'Chinese',
    price_tier: 1,
    lat: 37.4852,
    lng: -122.2275,
  },
]

export function seedPlaces(): Place[] {
  return placeSeeds.map((p, i) => ({
    ...p,
    id: placeId(i + 1),
    source: 'seed',
    created_at: SEED_CREATED,
  }))
}

type VisitSeed = Pick<Visit, 'place_id' | 'rating'> &
  Partial<Omit<Visit, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & { days: number }

const visitSeeds: VisitSeed[] = [
  {
    days: 1,
    place_id: placeId(2),
    rating: 'loved',
    dish_name: 'Beef noodle soup',
    photo_url: '/seed/noodles-beef-soup.svg',
    would_go_back: true,
    price_tier: 2,
    health_tags: ['comforting', 'protein_rich'],
    feeling: 'satisfied',
    note: 'Rainy-day order. The broth tastes like it has been going since morning.',
    story:
      'Mei runs the counter and told me the broth simmers for twelve hours. Her mother taught her, and she still hand-pulls the noodles on Sundays.',
  },
  {
    days: 4,
    place_id: placeId(1),
    rating: 'loved',
    dish_name: 'Roasted cauliflower & tahini bowl',
    photo_url: '/seed/bowl-roasted-cauliflower.svg',
    would_go_back: true,
    price_tier: 3,
    health_tags: ['veggie_forward', 'fresh'],
    feeling: 'energized',
    note: 'Lots of herbs and a squeeze of lemon. Good for a work lunch.',
    story: null,
  },
  {
    days: 7,
    place_id: placeId(3),
    rating: 'fine',
    dish_name: 'Salmon poke bowl',
    photo_url: '/seed/poke-salmon-bowl.svg',
    would_go_back: true,
    price_tier: 2,
    health_tags: ['light', 'protein_rich'],
    feeling: 'comfortable',
    note: 'Fresh fish, the sauce was a bit sweet for me. Next time I’ll ask for it on the side.',
    story: null,
  },
  {
    days: 10,
    place_id: placeId(4),
    rating: 'loved',
    dish_name: 'Tlayuda with black beans',
    photo_url: '/seed/tlayuda-black-beans.svg',
    would_go_back: true,
    price_tier: 2,
    health_tags: ['indulgent', 'comforting'],
    feeling: 'sleepy',
    note: 'Big enough to share. We took half home.',
    story:
      'The owner, Rosa, grinds the masa herself and sources her chiles from her cousin’s farm outside Oaxaca City. She slid a free mezcal sample across the counter “for the story.”',
  },
  {
    days: 14,
    place_id: placeId(5),
    rating: 'fine',
    dish_name: 'Lentil & kale soup',
    photo_url: '/seed/soup-lentil-kale.svg',
    would_go_back: false,
    price_tier: 2,
    health_tags: ['light', 'veggie_forward'],
    feeling: 'still_hungry',
    note: 'Pleasant but small. I’d pair it with bread next time.',
    story: null,
  },
  {
    days: 16,
    place_id: placeId(2),
    rating: 'loved',
    dish_name: 'Cold sesame noodles & scallion pancake',
    photo_url: '/seed/noodles-cold-sesame.svg',
    would_go_back: true,
    price_tier: 2,
    health_tags: ['comforting'],
    feeling: 'satisfied',
    note: null,
    story: null,
  },
  {
    days: 19,
    place_id: placeId(9),
    rating: 'not_for_me',
    dish_name: 'Four-cheese pizza',
    photo_url: '/seed/pizza-four-cheese.svg',
    would_go_back: false,
    price_tier: 3,
    health_tags: ['indulgent'],
    feeling: 'sleepy',
    note: 'Beautiful crust, just too rich for my taste. I’d try the seasonal salad next time.',
    story: null,
  },
  {
    days: 23,
    place_id: placeId(7),
    rating: 'loved',
    dish_name: 'Herb kuku sabzi plate',
    photo_url: '/seed/kuku-sabzi-plate.svg',
    would_go_back: true,
    price_tier: 3,
    health_tags: ['veggie_forward', 'protein_rich', 'fresh'],
    feeling: 'energized',
    note: 'So many herbs. Came with warm flatbread and a tangy yogurt dip.',
    story:
      'Chef Darya opened this place after years of cooking for family gatherings. She grows the mint and dill on the restaurant’s back patio and says the kuku recipe is her grandmother’s.',
  },
]

export function seedVisits(): Visit[] {
  return visitSeeds.map(({ days, ...v }, i) => {
    const when = daysAgo(days, 12 + (i % 3))
    return {
      id: visitId(i + 1),
      user_id: LOCAL_USER_ID,
      visited_at: when,
      photo_url: null,
      dish_name: null,
      would_go_back: null,
      price_tier: null,
      health_tags: [],
      feeling: null,
      note: null,
      story: null,
      ...v,
      created_at: when,
      updated_at: when,
    }
  })
}

export function seedWishlist(): WishlistItem[] {
  const base = (n: number, place: number, note: string | null, days: number): WishlistItem => ({
    id: wishId(n),
    user_id: LOCAL_USER_ID,
    place_id: placeId(place),
    note,
    status: 'want',
    visited_at: null,
    created_at: daysAgo(days),
  })
  return [
    base(1, 8, 'Special occasion. A friend raves about the grilled oysters.', 5),
    base(2, 11, 'Seasonal tasting menu, maybe for a birthday.', 12),
    base(3, 6, 'Seeded sourdough for a weekend morning.', 20),
  ]
}

export function seedLists(): { lists: PlaceList[]; items: PlaceListItem[] } {
  const lists: PlaceList[] = [
    {
      id: listId(1),
      user_id: LOCAL_USER_ID,
      name: 'Healthy-ish lunches on the Peninsula',
      description: 'Easy work-day lunches that leave me feeling good.',
      created_at: daysAgo(30),
      updated_at: daysAgo(30),
    },
    {
      id: listId(2),
      user_id: LOCAL_USER_ID,
      name: 'Cozy rainy-day bowls',
      description: null,
      created_at: daysAgo(18),
      updated_at: daysAgo(18),
    },
  ]
  const members: Array<[number, number]> = [
    [1, 1],
    [1, 6],
    [1, 12],
    [2, 2],
    [2, 5],
    [2, 10],
  ]
  const items: PlaceListItem[] = members.map(([list, place], i) => ({
    id: listItemId(i + 1),
    list_id: listId(list),
    place_id: placeId(place),
    position: members.slice(0, i).filter(([l]) => l === list).length,
    created_at: daysAgo(18),
  }))
  return { lists, items }
}

export function seedProfile(): Profile {
  return {
    id: LOCAL_USER_ID,
    display_name: 'Amelia',
    preferences: { show_health_tags: true, default_price_tier: 2, home_city: 'San Francisco' },
    created_at: SEED_CREATED,
    updated_at: SEED_CREATED,
  }
}

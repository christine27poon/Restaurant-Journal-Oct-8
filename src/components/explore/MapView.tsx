import { Map } from 'lucide-react'
import type { Place } from '@/types'

interface MapViewProps {
  places: Place[]
}

/**
 * Placeholder for the future map. No map library is integrated; this just reserves the
 * space and API (`places`) so the real implementation can drop in later.
 */
export function MapView({ places }: MapViewProps) {
  return (
    <section
      aria-label="Map (coming soon)"
      className="relative grid min-h-56 place-items-center overflow-hidden rounded-xl border border-line bg-sage-50 p-6 text-center md:min-h-72"
    >
      <div
        aria-hidden
        className="absolute inset-0 text-sage-100"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative max-w-xs">
        <span
          aria-hidden
          className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-surface text-sage-700 shadow-soft"
        >
          <Map className="h-6 w-6" />
        </span>
        <h2 className="text-h3">Map coming soon</h2>
        <p className="mt-1 text-body text-sage-800">
          {places.length} {places.length === 1 ? 'place' : 'places'} will appear here as pins.
        </p>
      </div>
    </section>
  )
}

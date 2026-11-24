import { MapPin, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { popularLocations, recentLocations } from '../data'
import type { LocationOption } from '../types'

interface LocationSheetProps {
  current: LocationOption
  onSelect: (location: LocationOption) => void
  onClose: () => void
}

function LocationSection({
  title,
  locations,
  currentId,
  onSelect,
}: {
  title: string
  locations: LocationOption[]
  currentId: string
  onSelect: (location: LocationOption) => void
}) {
  if (locations.length === 0) return null

  return (
    <section className="mb-5">
      <h4 className="mb-1 px-1 text-xs font-bold uppercase tracking-wide text-muted">{title}</h4>
      <ul>
        {locations.map((location) => (
          <li key={location.id}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-1 py-3 text-left text-inherit"
              onClick={() => onSelect(location)}
              aria-current={location.id === currentId ? 'true' : undefined}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xl" aria-hidden="true">
                {location.flag}
              </span>
              <span className={`min-w-0 flex-1 truncate text-[15px] font-semibold ${location.id === currentId ? 'text-blue-accent' : ''}`}>
                {location.city}
              </span>
              <span className="shrink-0 text-xs text-muted">{location.exact}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function LocationSheet({ current, onSelect, onClose }: LocationSheetProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const value = query.trim().toLowerCase()
  const matches = (location: LocationOption) =>
    !value ||
    location.city.toLowerCase().includes(value) ||
    location.label.toLowerCase().includes(value) ||
    location.exact.toLowerCase().includes(value)

  const select = (location: LocationOption) => {
    onSelect(location)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-400 flex animate-fade-in items-end justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85dvh] w-full max-w-107.5 animate-pop-in flex-col rounded-t-2xl bg-surface-2 px-5 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))]"
        role="dialog"
        aria-modal="true"
        aria-label="Change location"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 shrink-0 rounded-full bg-white" aria-hidden="true" />

        <div className="mb-5 flex shrink-0 items-center justify-center gap-2">
          <MapPin size={18} className="text-blue-accent" aria-hidden="true" />
          <h3 className="text-lg font-bold">Change Location</h3>
        </div>

        <div className="mb-5 flex shrink-0 flex-row gap-2 rounded-4xl bg-[#3e3e3e] px-2 py-1.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-500">
            <Search className="text-white" aria-hidden="true" />
          </div>
          <label className="flex w-full items-center gap-3 rounded-[25px] bg-surface px-3.75 py-2.5">
            <span className="sr-only">Search locations</span>
            <input
              type="search"
              placeholder="Search for"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              className="w-full border-0 bg-transparent text-[15px] text-white outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
            />
          </label>
        </div>

        <div className="scrollbar-none overflow-y-auto">
          <LocationSection
            title="Recent Locations"
            locations={recentLocations.filter(matches)}
            currentId={current.id}
            onSelect={select}
          />
          <LocationSection
            title="Popular Locations"
            locations={popularLocations.filter(matches)}
            currentId={current.id}
            onSelect={select}
          />
        </div>
      </div>
    </div>
  )
}

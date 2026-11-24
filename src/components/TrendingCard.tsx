import { Heart, MapPin } from 'lucide-react'
// import { displayDateTime } from '../lib/date'
import type { EventItem } from '../types'

interface TrendingCardProps {
  event: EventItem
  rank: number
  favourite: boolean
  onSelect: (event: EventItem) => void
  onToggleFavourite: (id: string) => void
}

/** Trending list card: outlined rank number, thumbnail, title with
 *  weekday • time and 📍 category underneath, heart toggle. */
export function TrendingCard({
  event,
  rank,
  favourite,
  onSelect,
  onToggleFavourite,
}: TrendingCardProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-sm border border-white/15 bg-surface-2 p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left text-inherit"
        onClick={() => onSelect(event)}
      >
        <span
          className="w-7 shrink-0 font-mono text-3xl font-extrabold text-transparent [-webkit-text-stroke:1px_var(--color-yellow-400)]"
          aria-hidden="true"
        >
          {String(rank).padStart(2, '0')}
        </span>
        <img src={event.image} className="h-12.5 w-12.5 shrink-0 rounded-md bg-[#333333] object-cover" alt="" loading="lazy" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[15px] font-semibold">{event.title}</span>
          <span className="mt-0.5 flex items-center justify-start gap-0.5 text-xs text-muted">
            {/* <span className="invisible">{displayDateTime(event.date)}</span> */}
            <MapPin size={11} className="shrink-0" aria-hidden="true" />
            <span className="shrink-0">{event.category}</span>
          </span>
        </span>
      </button>
      <button
        type="button"
        className={`flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-1 ${favourite ? 'text-red' : 'text-white'}`}
        onClick={() => onToggleFavourite(event.id)}
        aria-pressed={favourite}
        aria-label={
          favourite
            ? `Remove ${event.title} from favourites`
            : `Add ${event.title} to favourites`
        }
      >
        <Heart size={18} fill={favourite ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>
    </div>
  )
}
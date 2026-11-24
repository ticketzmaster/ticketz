import { format } from 'date-fns'
import { MapPin } from 'lucide-react'
import { displayDateTime, parseTicketDate } from '../lib/date'
import type { EventItem } from '../types'

interface FeaturedCardProps {
  event: EventItem
  onSelect: (event: EventItem) => void
}

/** "For You" card: photo on top, then a date block (red month / white day
 *  with red underline) beside the title, weekday • time and location. */
export function FeaturedCard({ event, onSelect }: FeaturedCardProps) {
  const date = parseTicketDate(event.date)

  return (
    <button
      type="button"
      className="w-65 shrink-0 cursor-pointer snap-start overflow-hidden rounded-lg border-0 bg-surface-2 p-0 text-left text-inherit"
      onClick={() => onSelect(event)}
    >
      <img src={event.image} className="block h-35 w-full bg-[#333333] object-cover" alt="" loading="lazy" />
      <div className="flex items-start gap-3 p-3">
        <div className="flex shrink-0 flex-col items-center pt-2">
          <span className="text-[11px] font-extrabold uppercase leading-tight text-red">
            {date ? format(date, 'MMM') : 'TBA'}
          </span>
          <span className="border-b-2 border-red text-[22px] font-extrabold leading-tight text-white">
            {date ? format(date, 'd') : '—'}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-base font-bold">{event.title}</span>
          <span className="mt-0.5 truncate text-[11px] text-muted">{displayDateTime(event.date)}</span>
          <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
            <MapPin size={12} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{event.location.split(',')[0]}</span>
          </span>
        </div>
      </div>
    </button>
  )
}
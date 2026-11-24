import { Bell, Bookmark, CalendarDays, Heart, Info, MapPin } from 'lucide-react'
import { useState } from 'react'
import type { EventItem } from '../types'
import { BookmarkSimpleIcon } from '@phosphor-icons/react'

interface WatchlistViewProps {
  favouriteEvents: EventItem[]
  onSelectEvent: (event: EventItem) => void
  onRemoveFavourite: (id: string) => void
}

const features = [
  {
    icon: CalendarDays,
    title: 'Save Events',
    body: 'Easily jump back into events that you have an interest in going to',
  },
  {
    icon: Bell,
    title: 'Never Miss A Presale',
    body: 'Set alerts so you never miss out on those presale tickets',
  },
  {
    icon: Info,
    title: 'Stay Informed',
    body: 'Receive alerts and updates about key event information',
  },
]

export function WatchlistView({
  favouriteEvents,
  onSelectEvent,
  onRemoveFavourite,
}: WatchlistViewProps) {
  const [tab, setTab] = useState<'events' | 'favourites'>('events')

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface">
      <header className="shrink-0 px-5 pb-2.5 pt-7.5 text-center">
        <h2 className="text-xl font-bold tracking-[1px]">WATCHLIST</h2>
        <p className="mt-1.25 text-[13px] text-muted tracking-wider">Keep track of what's important</p>
      </header>

      <div className="flex shrink-0 gap-2.5 px-5 py-2.5" role="tablist" aria-label="Watchlist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'events'}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[25px] border-0 p-3 text-sm font-semibold ${tab === 'events' ? 'bg-purple text-white' : 'bg-surface-2 text-muted'}`}
          onClick={() => setTab('events')}
        >
          <Bookmark size={16} aria-hidden="true" /> Events
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'favourites'}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[25px] border-0 p-3 text-sm font-semibold ${tab === 'favourites' ? 'bg-purple text-white' : 'bg-surface-2 text-muted'}`}
          onClick={() => setTab('favourites')}
        >
          <Heart size={16} aria-hidden="true" /> Favourites
        </button>
      </div>

      <main className="flex-1 overflow-y-auto overscroll-contain pb-[calc(var(--nav-height)+24px+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tab === 'events' ? (
          <>
            <div className="flex flex-col items-center px-5 py-10 text-center">
              <BookmarkSimpleIcon size={40} weight='fill' className="mb-3.75 text-purple" aria-hidden="true"  />
              <h3 className="mb-1.25 text-base">No Events Added</h3>
            </div>
            {features.map(({ icon: Icon, title, body }) => (
              <div className="flex w-full items-start gap-3.75 px-5 py-3.75 text-left" key={title}>
                <Icon size={18} className="shrink-0 mt-2 text-purple" aria-hidden="true" />
                <div>
                  <h4 className="text-sm font-semibold">{title}</h4>
                  <p className="mt-0.5 text-xs text-muted">{body}</p>
                </div>
              </div>
            ))}
          </>
        ) : favouriteEvents.length === 0 ? (
          <>
            <div className="flex flex-col items-center px-5 py-10 text-center">
              <Heart size={40} className="mb-3.75 text-purple" aria-hidden="true" />
              <h3 className="mb-1.25 text-base">No Favourites Yet</h3>
              <p className="mt-1 text-xs text-muted">Tap the heart on an event to keep it here.</p>
            </div>
            <div className="flex w-full items-center gap-3.75 px-5 py-3.75 text-left">
              <Heart size={18} className="shrink-0 text-purple" aria-hidden="true" />
              <div>
                <h4 className="text-sm font-semibold">Save Favourites</h4>
                <p className="mt-0.5 text-xs text-muted">Your favourite artists and events stay one tap away</p>
              </div>
            </div>
          </>
        ) : (
          <div>
            {favouriteEvents.map((event) => (
              <div className="flex items-center gap-2.5 border-b border-[#222222] px-5 py-2.5" key={event.id}>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.75 border-0 bg-transparent p-0 text-left text-inherit"
                  onClick={() => onSelectEvent(event)}
                >
                  <img src={event.image} className="h-12.5 w-12.5 shrink-0 rounded-md bg-[#333333] object-cover" alt="" loading="lazy" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[15px] font-semibold">{event.title}</span>
                    <span className="mt-0.75 flex items-center gap-1 text-xs text-muted">
                      <MapPin size={11} aria-hidden="true" /> {event.location}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className="flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-1 text-red"
                  onClick={() => onRemoveFavourite(event.id)}
                  aria-label={`Remove ${event.title} from favourites`}
                >
                  <Heart size={18} fill="currentColor" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

import { ChevronRight, Globe, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FeaturedCard } from "../components/FeaturedCard";
import { TrendingCard } from "../components/TrendingCard";
import { getEventsForLocation } from "../data";
import { displayTicketDate } from "../lib/date";
import type { EventItem, LocationOption } from "../types";

interface HomeViewProps {
  location: LocationOption;
  favourites: string[];
  onSelectEvent: (event: EventItem) => void;
  onToggleFavourite: (id: string) => void;
  onChangeLocation: () => void;
}

const matches = (event: EventItem, query: string) => {
  const value = query.trim().toLowerCase();
  if (!value) return true;
  return (
    event.title.toLowerCase().includes(value) ||
    event.location.toLowerCase().includes(value)
  );
};

export function HomeView({
  location,
  favourites,
  onSelectEvent,
  onToggleFavourite,
  onChangeLocation,
}: HomeViewProps) {
  const [query, setQuery] = useState("");

  const events = useMemo(() => getEventsForLocation(location), [location]);
  const featured = useMemo(
    () => events.featured.filter((e) => matches(e, query)),
    [events, query],
  );
  const trending = useMemo(
    () => events.trending.filter((e) => matches(e, query)),
    [events, query],
  );
  const recommended = matches(events.recommended, query)
    ? [events.recommended]
    : [];
  const empty = featured.length + trending.length + recommended.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface">
      <header className="flex shrink-0 items-center justify-between bg-surface px-5 py-3.75">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[15px] font-semibold text-inherit"
          onClick={onChangeLocation}
          aria-label={`Change location, currently ${location.label}`}
        >
          <MapPin size={18} className="text-blue-accent" aria-hidden="true" />
          <span>{location.label}</span>
          <ChevronRight size={12} className="text-muted" aria-hidden="true" />
        </button>
        <span className="flex items-center gap-1.25 rounded-[20px] bg-surface-2 px-3 py-1.25 text-xs font-semibold">
          <Globe size={13} className="text-blue-accent" aria-hidden="true" /> EN
        </span>
      </header>

      <div className="shrink-0 bg-surface px-5 pb-3.75">
        <div className="flex flex-row px-2 py-1.5 bg-[#3e3e3e] rounded-4xl gap-2">
          <div className="p-3 bg-blue-500 rounded-full w-12 h-12">
            <Search  className="text-white "/>
          </div>
          <label className="flex w-full items-center gap-3 rounded-[25px] bg-surface px-3.75 py-2.5">
            <span className="sr-only">Search for events</span>
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
      </div>

      <main className="flex-1 overflow-y-auto overscroll-contain pb-[calc(var(--nav-height)+24px+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch] scrollbar-none">
        {featured.length > 0 && (
          <>
            <h2 className="px-5 pb-2.5 pt-3.75 text-lg font-bold">For You</h2>
            <div className="flex snap-x snap-mandatory gap-3.75 overflow-x-auto px-5 pb-3.75 scrollbar-none">
              {featured.map((event) => (
                <FeaturedCard
                  key={event.id}
                  event={event}
                  onSelect={onSelectEvent}
                />
              ))}
            </div>
          </>
        )}

        {trending.length > 0 && (
          <>
            <h2 className="px-5 pb-2.5 pt-3.75 text-lg font-bold">
              Trending In {location.city}
            </h2>
            <div className="flex justify-end px-5 pb-2.5 text-[13px] text-muted">
              <span>View All</span>
            </div>
            {/* 3 rows per column; each column ~80% wide so the next one peeks
                in from the right and hints at horizontal scrolling. */}
            <div className="grid snap-x grid-flow-col auto-cols-[80%] grid-rows-3 gap-3 overflow-x-auto px-5 pb-3.75 scrollbar-none">
              {trending.map((event, index) => (
                <TrendingCard
                  key={event.id}
                  event={event}
                  rank={index + 1}
                  favourite={favourites.includes(event.id)}
                  onSelect={onSelectEvent}
                  onToggleFavourite={onToggleFavourite}
                />
              ))}
            </div>
          </>
        )}

        {recommended.map((event) => (
          <div key={event.id}>
            <h2 className="px-5 pb-2.5 pt-3.75 text-lg font-bold">
              Recommended For You
            </h2>
            <button
              type="button"
              className="mx-5 mb-3.75 block w-[calc(100%-40px)] cursor-pointer overflow-hidden rounded-card border-0 bg-surface-2 p-0 text-left text-inherit"
              onClick={() => onSelectEvent(event)}
            >
              <img
                src={event.image}
                className="block h-45 w-full bg-[#333333] object-cover"
                alt=""
                loading="lazy"
              />
              <div className="p-3.75">
                <div className="mb-1.25 text-xs font-extrabold text-red">
                  {displayTicketDate(event.date)}
                </div>
                <div className="mb-1.25 text-lg font-bold">{event.title}</div>
                <div className="flex items-center gap-1.25 text-xs text-muted">
                  <MapPin size={12} aria-hidden="true" />
                  {event.location}
                </div>
              </div>
            </button>
          </div>
        ))}

        {empty && (
          <div className="flex flex-col items-center px-5 py-10 text-center">
            <Search
              size={40}
              className="mb-3.75 text-purple"
              aria-hidden="true"
            />
            <h3 className="mb-1.25 text-base">No events found</h3>
            <p className="mt-1 text-xs text-muted">
              Try a different artist, venue or city.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

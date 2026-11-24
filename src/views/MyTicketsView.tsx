import {
  CalendarPlus,
  ChevronRight,
  MapPin,
  Archive as TicketIcon,
} from "lucide-react";
import { useState } from "react";
import { getSampleTicket } from "../data";
import { LongPressDelete } from "../components/LongPressDelete";
import { TicketSummary } from "../components/TicketSummary";
import {
  daysUntilNextTicket,
  displayTicketDate,
  parseTicketDate,
} from "../lib/date";
import type { LocationOption, Ticket } from "../types";

interface MyTicketsViewProps {
  location: LocationOption;
  tickets: Ticket[];
  sampleVisible: boolean;
  onOpenOrder: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
  onDeleteSample: () => void;
}

function TicketCard({
  ticket,
  onOpen,
  days,
}: {
  ticket: Ticket;
  onOpen: (ticket: Ticket) => void;
  days?: number;
}) {
  return (
    <div className="relative overflow-hidden py-5 px-4">
      <img
        src={ticket.image}
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
        alt=""
        aria-hidden="true"
      />
      {days !== undefined && (
        <div className="relative flex items-center justify-between px-5 py-6.5 text-[15px] font-semibold text-white">
          <span>
            Next Event: <span>{days}</span> days
          </span>
          <CalendarPlus size={20} className="text-white" aria-hidden="true" />
        </div>
      )}
      <article className="relative flex flex-col bg-surface-2">
        <img
          src={ticket.image}
          className="block h-120 w-full bg-[#333333] object-cover"
          alt=""
          loading="lazy"
        />
        <TicketSummary ticket={ticket} />
        <button
          type="button"
          className=" w-full cursor-pointer items-center justify-center gap-2 border-0 bg-blue-action p-4 text-[15px] font-bold text-white"
          onClick={() => onOpen(ticket)}
        >
           View Tickets
        </button>
      </article>
    </div>
  );
}

export function MyTicketsView({
  location,
  tickets,
  sampleVisible,
  onOpenOrder,
  onDeleteTicket,
  onDeleteSample,
}: MyTicketsViewProps) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [now] = useState(() => Date.now());

  const sample = getSampleTicket(location);
  const all = sampleVisible ? [...tickets, sample] : tickets;
  const upcoming = all.filter((ticket) => {
    const date = parseTicketDate(ticket.date);
    return !date || date.getTime() >= now;
  });
  const past = all.filter((ticket) => {
    const date = parseTicketDate(ticket.date);
    return date !== null && date.getTime() < now;
  });

  const days = daysUntilNextTicket(
    upcoming
      .map((ticket) => parseTicketDate(ticket.date))
      .filter((date): date is Date => date !== null),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface">
      <header className="relative flex shrink-0 items-center justify-center p-5">
        <h2 className="text-base font-semibold">My Events {location.flag}</h2>
        <span className="absolute right-5 text-[13px] text-white">Help</span>
      </header>

      <div
        className="mx-5 flex shrink-0 border-b border-[#333333]"
        role="tablist"
        aria-label="My tickets"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "upcoming"}
          className={`flex-1 cursor-pointer border-0 border-b-2 bg-transparent py-3 text-center text-xs font-semibold ${tab === "upcoming" ? "border-white text-white" : "border-transparent text-muted"}`}
          onClick={() => setTab("upcoming")}
        >
          UPCOMING ({upcoming.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "past"}
          className={`flex-1 cursor-pointer border-0 border-b-2 bg-transparent py-3 text-center text-xs font-semibold ${tab === "past" ? "border-white text-white" : "border-transparent text-muted"}`}
          onClick={() => setTab("past")}
        >
          PAST ({past.length})
        </button>
      </div>

      <main className="flex-1 overflow-y-auto overscroll-contain pb-[calc(var(--nav-height)+24px+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tab === "upcoming" ? (
          <>
            {upcoming.map((ticket) => (
              <LongPressDelete
                key={ticket.id}
                onDelete={() =>
                  ticket.id === "sample-oasis"
                    ? onDeleteSample()
                    : onDeleteTicket(ticket.id)
                }
              >
                <TicketCard ticket={ticket} onOpen={onOpenOrder} days={days} />
              </LongPressDelete>
            ))}

            {upcoming.length > 0 && (
              <section className="pt-3.75">
                <h2 className="px-5 pb-2.5 text-lg font-bold">
                  All Upcoming Events
                </h2>
                {upcoming.map((ticket) => (
                  <button
                    type="button"
                    key={ticket.id}
                    className="mx-5 mb-2.5 flex w-[calc(100%-40px)] cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-surface-2 p-2.5 text-left text-inherit shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    onClick={() => onOpenOrder(ticket)}
                  >
                    <img
                      src={ticket.image}
                      className="h-12.5 w-12.5 shrink-0 rounded-md bg-[#333333] object-cover"
                      alt=""
                      loading="lazy"
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[15px] font-semibold">
                        {ticket.event.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted">
                        {displayTicketDate(ticket.date)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <MapPin size={11} className="shrink-0" aria-hidden="true" />
                        <span className="truncate">{ticket.loc}</span>
                      </span>
                      <span className="flex items-center gap-1 text-xs text-green-300 pl-2">
                        {ticket.amount} ticket{ticket.amount === 1 ? '' : 's'}
                      </span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-white">
                      <ChevronRight size={18} aria-hidden="true" />
                    </span>
                  </button>
                ))}
              </section>
            )}

            {upcoming.length === 0 && (
              <div className="flex flex-col items-center px-5 py-10 text-center">
                <TicketIcon
                  size={40}
                  className="mb-3.75 text-purple"
                  aria-hidden="true"
                />
                <h3 className="mb-1.25 text-base">No Upcoming Tickets</h3>
                <p className="mt-1 text-xs text-muted">
                  Generate a ticket from your account to preview it here.
                </p>
              </div>
            )}
          </>
        ) : past.length > 0 ? (
          past.map((ticket) => (
            <LongPressDelete
              key={ticket.id}
              onDelete={() =>
                ticket.id === "sample-oasis"
                  ? onDeleteSample()
                  : onDeleteTicket(ticket.id)
              }
            >
              <TicketCard ticket={ticket} onOpen={onOpenOrder} />
            </LongPressDelete>
          ))
        ) : (
          <div className="flex flex-col items-center px-5 py-10 text-center">
            <TicketIcon
              size={40}
              className="mb-3.75 text-purple"
              aria-hidden="true"
            />
            <h3 className="mb-1.25 text-base">No Past Events</h3>
            <p className="mt-1 text-xs text-muted">
              Tickets for events that have already happened will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

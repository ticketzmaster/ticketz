import { Archive as TicketIcon } from 'lucide-react'
import { displayTicketDate } from '../lib/date'
import type { Ticket } from '../types'

interface TicketSummaryProps {
  ticket: Ticket
}

/** The floating details block of a ticket card: separate date rectangle,
 *  event title, location and ticket count. Shared by My Tickets and the
 *  order details screen. */
export function TicketSummary({ ticket }: TicketSummaryProps) {
  return (
    <>
      <div className="relative left-0 z-10 -mt-12 w-fit bg-surface-2 px-3 py-3 text-[11px] font-bold uppercase text-white">
        {displayTicketDate(ticket.date)}
      </div>
      <div className="bg-surface-2 p-3.75">
        <div className="mb-1.25 text-2xl font-extrabold">
          {ticket.event.toUpperCase()}
        </div>
        <div className="mb-1.25 flex items-center justify-between gap-2 text-[13px] tracking-wider text-muted-2">
          <span>{ticket.loc}</span>
          <span className="flex shrink-0 items-center gap-1.25">
            <TicketIcon
              size={18}
              className="rotate-[-5deg] skew-y-[-5deg] text-white"
              aria-hidden="true"
            />{' '}
            x{ticket.amount}
          </span>
        </div>
      </div>
    </>
  )
}

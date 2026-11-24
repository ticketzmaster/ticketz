import { format } from 'date-fns'
import { BarcodeIcon } from '@phosphor-icons/react'
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  EllipsisVertical,
  Navigation,
  Receipt,
  RefreshCw,
} from 'lucide-react'
import { useState } from 'react'
import { TicketSummary } from '../components/TicketSummary'
import { displayTicketDate } from '../lib/date'
import type { Ticket } from '../types'

interface OrderDetailsViewProps {
  ticket: Ticket
  onClose: () => void
  onViewTickets: () => void
  onViewReceipt?: () => void
  onTransfer: () => void
}

export function OrderDetailsView({
  ticket,
  onClose,
  onViewTickets,
  onViewReceipt,
  onTransfer,
}: OrderDetailsViewProps) {
  const [tab, setTab] = useState<'tickets' | 'extras'>('tickets')
  const [sheetOpen, setSheetOpen] = useState(false)
  const purchaseDate = format(new Date(), 'MMM d, yyyy')

  return (
    <section className="absolute inset-0 z-200 flex flex-col overflow-y-auto overscroll-contain bg-surface pb-[calc(110px+env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={`Order details for ${ticket.event}`}>
      <div className="relative h-75 shrink-0 bg-black">
        <img src={ticket.image} className="block h-full w-full object-cover opacity-70" alt="" />
        <div className="absolute inset-x-5 top-[calc(20px+env(safe-area-inset-top))] z-10 flex items-center justify-between">
          <button type="button" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-black/60 text-white" onClick={onClose} aria-label="Back">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <span className="rounded-[20px] bg-black/60 px-4 py-2 text-[13px] font-semibold">Help</span>
        </div>
      </div>

      {/* Floating ticket summary: its top quarter overlaps the hero image. */}
      <div className="relative z-10 -mt-1.75 shrink-0 px-4 shadow-2xl">
        <TicketSummary ticket={ticket} />
        <button type="button" className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 border-0 bg-blue-action p-4 text-base font-bold text-white" onClick={onViewTickets}>
        <BarcodeIcon size={28} weight='bold' aria-hidden="true" /> View Tickets
      </button>
      </div>

      

      <div className="mx-5 mt-3.75 flex shrink-0 border-b border-[#333333]" role="tablist" aria-label="Order details">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'tickets'}
          className={`flex-1 cursor-pointer border-0 border-b-2 bg-transparent py-3 text-center text-sm font-semibold ${tab === 'tickets' ? 'border-white text-white' : 'border-transparent text-muted'}`}
          onClick={() => setTab('tickets')}
        >
          Tickets
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'extras'}
          className={`flex-1 cursor-pointer border-0 border-b-2 bg-transparent py-3 text-center text-sm font-semibold ${tab === 'extras' ? 'border-white text-white' : 'border-transparent text-muted'}`}
          onClick={() => setTab('extras')}
        >
          Extras
        </button>
      </div>

      {tab === 'tickets' ? (
        <div className="shrink-0 p-5">
          <div className="mb-3.75 flex items-start justify-between">
            <div>
              <div className="text-lg font-bold">Order #{ticket.orderNum}</div>
              <div className="mt-0.5 text-[13px] text-muted">x{ticket.amount} Tickets </div>
            </div>
            <button
              type="button"
              className="flex cursor-pointer items-center border-0 bg-transparent p-0 text-muted"
              onClick={() => setSheetOpen(true)}
              aria-label="More order details"
            >
              <EllipsisVertical size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {ticket.variants.map((variant, index) => (
              <div key={index} className="overflow-hidden rounded-lg bg-surface-2">
                <div className="flex items-center justify-between border-b border-[#333333] p-3.75 text-[15px] font-bold">
                  <span>General Admission</span>
                  <span className="text-xs font-semibold text-muted">Ticket {index + 1}</span>
                </div>
                <div className="flex gap-3 p-3.75">
                  <div className="flex-1">
                    <div className="mb-1.25 text-xs font-semibold tracking-[0.5px] text-muted">SECTION</div>
                    <div className="text-lg font-bold">{variant.section}</div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1.25 text-xs font-semibold tracking-[0.5px] text-muted">ROW</div>
                    <div className="text-lg font-bold">{variant.row}</div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1.25 text-xs font-semibold tracking-[0.5px] text-muted">SEAT</div>
                    <div className="text-lg font-bold">{variant.seat}</div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1.25 text-xs font-semibold tracking-[0.5px] text-muted">GATE</div>
                    <div className="text-lg font-bold">{variant.entrance}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3.75 text-[15px] font-bold">More Options</div>
          <div className="relative mt-2.5 h-60 overflow-hidden rounded-lg bg-surface-2">
            <iframe
              title={`Map of ${ticket.loc}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(ticket.loc)}&output=embed`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-x-0 top-0 bg-linear-to-b from-black/80 to-transparent px-3.75 py-3">
              <div className="text-[15px] font-bold text-white">{ticket.loc}</div>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-blue-action p-3.75 text-sm font-bold text-white"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.loc)}`,
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            <Navigation size={16} aria-hidden="true" /> Get Directions
          </button>

          <section className="mt-6">
            <div className="relative flex flex-col overflow-hidden border border-white/10 bg-surface-2">
              <img
                src={ticket.image}
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                alt=""
                aria-hidden="true"
              />

              <div className="relative flex items-stretch gap-3 p-3">
                <div className="w-3/5 shrink-0 bg-surface-2 p-2">
                  <article className="relative flex flex-col overflow-hidden bg-surface-2">
                    <img
                      src={ticket.image}
                      className="block h-20 w-full bg-[#333333] object-cover"
                      alt=""
                      loading="lazy"
                    />
                    <div className="relative z-10 -mt-3 w-fit bg-surface-2 px-2 py-1 text-[7px] font-bold uppercase text-white">
                      {displayTicketDate(ticket.date)}
                    </div>
                    <div className="bg-surface-2 p-2">
                      <div className="text-[11px] font-extrabold leading-tight">
                        {ticket.event.toUpperCase()}
                      </div>
                      <div className="mt-1 truncate text-[7px] tracking-wide text-muted-2">
                        {ticket.loc}
                      </div>
                    </div>
                  </article>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="text-md font-bold uppercase text-white">
                    you got <br/> tickets
                    <div className="mt-1 h-0.5 w-full bg-black" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="relative bg-black p-3">
                <h3 className="text-md font-bold text-white">Post on social media</h3>
                <p className="mt-1 text-[12px] leading-snug text-white/80">
                  Build hype for the event, and share that you got tickets with you friends and
                  family
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="px-5 py-10 text-center text-sm text-muted">
          <p>No extras were added to this order.</p>
        </div>
      )}

      <div className="fixed bottom-[calc(32px+env(safe-area-inset-bottom))] left-1/2 z-250 flex w-[calc(100%-40px)] max-w-97.5 -translate-x-1/2 rounded-[30px] bg-white/95 p-1.25 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur">
        <div className="flex flex-1 flex-col items-center justify-center border-r border-[#eeeeee] bg-transparent py-2.5 text-xs font-semibold text-[#555555] last:border-r-0">
          <ArrowUp size={18} className="mb-1.25 text-muted" aria-hidden="true" />
          Upgrade
        </div>
        <button type="button" className="flex flex-1 cursor-pointer flex-col items-center justify-center border-r border-[#eeeeee] bg-transparent py-2.5 text-xs font-semibold text-blue-action last:border-r-0" onClick={onTransfer}>
          <ArrowUpRight size={18} className="mb-1.25 text-blue-action" aria-hidden="true" />
          Transfer
        </button>
        <div className="flex flex-1 flex-col items-center justify-center border-r border-[#eeeeee] bg-transparent py-2.5 text-xs font-semibold text-[#555555] last:border-r-0">
          <RefreshCw size={18} className="mb-1.25 text-muted" aria-hidden="true" />
          Sell
        </div>
      </div>

      {sheetOpen && (
        <div
          className="fixed inset-0 z-400 flex animate-fade-in items-end justify-center bg-black/70"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="w-full max-w-[430px] animate-pop-in rounded-t-2xl bg-surface-2 px-5 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))]"
            role="dialog"
            aria-modal="true"
            aria-label="Order details"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white" aria-hidden="true" />
            <h3 className="mb-3.75 text-center text-lg font-bold">Order Details</h3>
            <div className="mb-3.75 border-t border-[#333333]" />
            <dl className="mb-5 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Order Number</dt>
                <dd className="font-semibold">#{ticket.orderNum}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Purchase Date</dt>
                <dd className="font-semibold">{purchaseDate}</dd>
              </div>
            </dl>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-blue-action p-4 text-sm font-bold text-white"
                onClick={() => {
                  setSheetOpen(false)
                  onViewReceipt?.()
                }}
              >
                <Receipt size={18} aria-hidden="true" /> View Receipt
              </button>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-surface-3 p-4 text-sm font-bold text-white"
                onClick={() => {
                  setSheetOpen(false)
                  onViewTickets()
                }}
              >
                <BarcodeIcon size={20} weight="bold" aria-hidden="true" /> View Order
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

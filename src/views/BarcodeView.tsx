import { format } from 'date-fns'
import { ArrowLeft, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { parseTicketDate, sentenceCase } from '../lib/date'
import type { Ticket, TicketVariant } from '../types'
import { InfoIcon } from '@phosphor-icons/react'

interface BarcodeViewProps {
  ticket: Ticket
  onClose: () => void
}

interface TicketInsetProps {
  ticket: Ticket
  variant: TicketVariant
  index: number
  active: boolean
}

const randomBarcode = (event: string) =>
  `${event.trim().replace(/\s+/g, '-').toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`

function TicketInset({ ticket, variant, index, active }: TicketInsetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [barcodeValue] = useState(() => randomBarcode(ticket.event))

  useEffect(() => {
    let cancelled = false

    // Loaded on demand: the PDF417 renderer is by far the heaviest dependency.
    import('bwip-js/browser').then(({ default: bwipjs }) => {
      const canvas = canvasRef.current
      if (cancelled || !canvas) return

      try {
        bwipjs.toCanvas(canvas, {
          bcid: 'pdf417',
          text: barcodeValue,
          scale: 3,
          height: 10,
          includetext: false,
          textxalign: 'center',
          padding: 0,
        })
      } catch (error) {
        console.error('Barcode generation failed', error)
      }
    })

    return () => {
      cancelled = true
    }
  }, [barcodeValue])

  const seatDetails = [
    { label: 'Section', value: variant.section },
    { label: 'Row', value: variant.row },
    { label: 'Seat', value: variant.seat },
  ]

  return (
    <article
      data-ticket-card
      className={`w-[86%] shrink-0 snap-center overflow-hidden rounded-xs bg-[#f5f5f5] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-all duration-300 ${
        active ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
      }`}
    >
      <div className="relative h-100.5 bg-black">
        <img src={ticket.image} className="block h-full w-full object-cover opacity-60" alt="" />
        <div className="absolute inset-x-4 top-4 rounded-xs bg-white p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="mb-3 flex items-center justify-center gap-2 text-[13px] font-medium text-muted">
            Screenshots won't get you in <RotateCw size={14} className="text-muted" aria-hidden="true" />
          </div>
          <div className="relative flex w-full justify-center overflow-hidden py-1.25">
            <canvas ref={canvasRef} id={`barcode-canvas-${index}`} className="block h-25 max-w-full object-contain" />
            <div className="absolute inset-y-0 z-10 w-0.75 animate-scan bg-blue-action shadow-[0_0_8px_2px_rgba(40,67,204,0.6)]" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-lg font-extrabold">STANDARD</div>
          <div className="text-[11px] font-semibold text-[#777777]">
            Ticket {index + 1} of {ticket.amount}
          </div>
        </div>
        <div className="mb-4 border-b border-[#cccccc] pb-3 text-sm text-[#555555]">General Admission</div>

        <dl className="flex items-start justify-between gap-2">
          {seatDetails.map(({ label, value }) => (
            <div key={label} className="min-w-0 flex-1">
              <dt className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted">{label}</dt>
              <dd className="truncate text-2xl font-extrabold leading-none text-black">{value}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          className="mt-4 w-full cursor-pointer border-0 bg-black py-3.5 text-sm font-bold text-white"
        >
          Early Entry
        </button>
      </div>
    </article>
  )
}

export function BarcodeView({ ticket, onClose }: BarcodeViewProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const parsedDate = parseTicketDate(ticket.date)
  const datePart = parsedDate ? format(parsedDate, 'MMM d, yyyy • h:mm a') : ticket.date
  const locationPart = ticket.loc.split(',')[0]

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    const maxScroll = track.scrollWidth - track.clientWidth
    if (maxScroll <= 0) return
    const next = Math.round(
      (track.scrollLeft / maxScroll) * (ticket.variants.length - 1),
    )
    setActiveIndex(Math.min(ticket.variants.length - 1, Math.max(0, next)))
  }

  return (
    <section
      className="absolute inset-0 z-300 flex flex-col overflow-y-auto overscroll-contain bg-white pt-[env(safe-area-inset-top)] text-black [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label={`Ticket for ${ticket.event}`}
    >
      <header className="flex shrink-0 items-center gap-3.75 border-b border-[#e0e0e0] bg-white px-5 pb-5 pt-5">
        <button type="button" className="flex cursor-pointer border-0 bg-transparent p-0 text-black" onClick={onClose} aria-label="Back">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div>
          <h2 className="text-base font-bold">{sentenceCase(ticket.event)}</h2>
          <p className="mt-0.5 text-[13px] text-[#666666]">
            {datePart} - {locationPart}
          </p>
        </div>
      </header>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pt-5 pb-2"
        aria-label={`${ticket.amount} tickets`}
      >
        {ticket.variants.map((variant, index) => (
          <TicketInset
            key={index}
            ticket={ticket}
            variant={variant}
            index={index}
            active={index === activeIndex}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 py-4" aria-hidden="true">
        {ticket.variants.map((_, index) => (
          <span
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-6 bg-black' : 'w-2 bg-[#cccccc]'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-1">
        <button
          type="button"
          className="flex  cursor-pointer rounded-xl items-center justify-center border-0 bg-black px-4 py-2.5"
        >
          <img
            src="/add-to-apple-wallet.svg"
            alt="Add to Apple Wallet"
            className="h-9 w-auto max-w-full object-contain"
          />
        </button>

        <button
          type="button"
          className="flex  cursor-pointer  items-center justify-center gap-2 rounded-4xl border border-black/25 bg-transparent px-3 py-2.5 text-black"
        >
          <span className="flex p-2 items-center justify-center rounded-full bg-black text-white">
            <InfoIcon size={32}/>
          </span>
          <span className="text-sm font-semibold">Ticket info</span>
        </button>
      </div>
    </section>
  )
}

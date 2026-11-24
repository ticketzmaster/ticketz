import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { parseTicketDate, sentenceCase } from '../lib/date'
import type { ReceiptSettings, Ticket } from '../types'

interface ReceiptPageProps {
  ticket: Ticket
  settings: ReceiptSettings
  onClose: () => void
}

export function ReceiptPage({ ticket, settings, onClose }: ReceiptPageProps) {
  const eventDate = parseTicketDate(ticket.date)
  const dateText = eventDate ? format(eventDate, 'MMM d, yyyy') : ticket.date
  const timeText = eventDate ? format(eventDate, 'h:mm a') : ''
  const orderDate = format(new Date(), 'MMM d, yyyy')

  const money = (value: number) => `$${value.toFixed(2)}`
  const facilityRate = Number(settings.facilityCharge) || 0
  const serviceRate = Number(settings.serviceFee) || 0
  const deliveryLabel = settings.delivery.trim() || 'Free'
  const ticketTotal = ticket.price * ticket.amount
  const facilityTotal = facilityRate * ticket.amount
  const serviceFeeTotal = serviceRate * ticket.amount
  const total = ticketTotal + facilityTotal + serviceFeeTotal

  return (
    <section
      className="absolute inset-0 z-300 flex flex-col overflow-y-auto overscroll-contain bg-white pt-[env(safe-area-inset-top)] text-black [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label={`Receipt for order ${ticket.orderNum}`}
    >
      <header className="shrink-0 px-5 pt-5">
        <button
          type="button"
          className="flex cursor-pointer border-0 bg-transparent p-0 text-black"
          onClick={onClose}
          aria-label="Back"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>

        <div className=" flex flex-col  items-center justify-center mt-5">
          <h1 className="text-xl font-bold tracking-widest text-black">Order #{ticket.orderNum}/TRK</h1>
          <div className="mt-1 flex flex-col gap-0.5 text-xs tracking-widest font-light text-black">
            <span>ORDER DATE: {orderDate}  . {timeText}</span> 
          </div>
          <hr className="mt-4 border-0 border-t border-black/30" />
        </div>
      </header>
            <hr className='w-full px-4 text-gray-300'/>


      <div className="flex flex-col px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <div className="flex flex-col pt-5">
          <h2 className="text-xl font-bold text-black">{sentenceCase(ticket.event)}</h2>
          <p className="text-sm text-black  font-light mt-2tracking-wider">{ticket.loc}</p>
          <p className="text-sm text-black  font-light mt-2">{dateText} . {timeText}</p>
        </div>

        <section className="mt-6 flex flex-col gap-6">
          <h3 className="text-sm font-medium text-black">Tickets</h3>
          <div className="flex flex-col gap-4">
            {ticket.variants.map((variant, index) => (
              <div key={index} className="flex items-start justify-between gap-4">
                <div className="flex flex-col items-start justify-start text-sm text-black">
                  <span className="font-medium text-black">ARTIST PRESALE</span>
                  <div className='flex gap-2 mt-2'>
                    <p className="font-light uppercase text-xs">Section <br/> <span className='font-semibold tracking-wide'>{variant.section}</span></p>
                    <p className="font-light uppercase text-xs">Row <br/> <span className='font-semibold tracking-wide'>{variant.row}</span></p>
                    <p className="font-light uppercase text-xs">Seat <br/> <span className='font-semibold tracking-wide'>{variant.seat}</span></p>

                  </div>
                </div>
                <span className="text-sm font-bold text-black">{money(ticket.price)}</span>
              </div>
            ))}
          </div>
        </section>

        <div className='p-2 flex px-4 bg-gray-200 mt-12 items-center justify-between text-xl font-bold'>
          <p >Subtotal</p>

          <p >USD {money(ticketTotal)}</p>

        </div>

        <div className='flex flex-col px-4 py-3 mt-8 bg-gray-200 text-sm gap-3'>
          <p className='font-bold uppercase tracking-wide'>Fees</p>

          <div className='flex items-start justify-between gap-4'>
            <div className='flex flex-col items-start'>
              <span className='font-light'>Facility charge</span>
              <span className='font-light'>{money(facilityRate)} × {ticket.amount}</span>
            </div>
            <span className='font-light'>USD {money(facilityTotal)}</span>
          </div>

          <div className='flex items-start justify-between gap-4'>
            <div className='flex flex-col items-start'>
              <span className='font-light text-black'>Service fee</span>
              <span className='font-light text-black'>{money(serviceRate)} × {ticket.amount}</span>
            </div>
            <span className='font-light text-black'>USD {money(serviceFeeTotal)}</span>
          </div>
        </div>

        <section className='flex flex-col gap-2 px-4 mt-8 text-sm font-bold uppercase'>
          <p>Delivery</p>
          <div className='flex items-center justify-between'>
            <span className="font-light text-black">Mobile</span>
            <span className="font-light text-black">{deliveryLabel}</span>
          </div>
        </section>

        <div className='flex items-center justify-between px-4 pt-4 mt-8 border-t border-black/30 text-xl font-bold'>
          <p>Total</p>
          <p>USD {money(total)}</p>
        </div>
      </div>
    </section>
  )
}

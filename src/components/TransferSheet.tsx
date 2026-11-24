import { Check, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import type { Ticket } from '../types'

type Stage = 'loading' | 'auth' | 'select' | 'recipient' | 'success'

interface TransferSheetProps {
  ticket: Ticket
  onClose: () => void
}

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString()

const inputClass =
  'w-full rounded-lg border border-[#333333] bg-surface p-3.75 text-[15px] text-white outline-none placeholder:text-muted focus:border-blue-action'

export function TransferSheet({ ticket, onClose }: TransferSheetProps) {
  const [stage, setStage] = useState<Stage>('loading')
  const [code] = useState(generateCode)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([0])
  const [enteredCode, setEnteredCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')

  const selectedVariants = selectedSeats.map((index) => ticket.variants[index])
  const firstVariant = selectedVariants[0]
  const selectedSummary = firstVariant
    ? `Sec ${firstVariant.section}, row ${firstVariant.row}, seat ${selectedVariants.map((variant) => variant.seat).join(', ')}`
    : ''

  useEffect(() => {
    const timer = window.setTimeout(() => setStage('auth'), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    if (typeof Notification === 'undefined') return

    const sendNotification = () => {
      try {
        new Notification('Ticketmaster', {
          body: `Your Ticketmaster verification code is ${code}. Do not share this code with anyone....`,
        })
      } catch {
        // Notifications can be unavailable in embedded previews; the code is on screen.
      }
    }

    if (Notification.permission === 'granted') {
      sendNotification()
    } else if (Notification.permission === 'default') {
      void Promise.resolve(Notification.requestPermission())
        .then((permission) => {
          if (permission === 'granted') sendNotification()
        })
        .catch(() => {})
    }
  }, [code])

  function handleSend(event: FormEvent) {
    event.preventDefault()
    setStage('success')
  }

  return (
    <div
      className="fixed inset-0 z-400 flex animate-fade-in items-end justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88dvh] w-full max-w-107.5 animate-pop-in flex-col rounded-t-2xl bg-surface-2 px-5 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))]"
        role="dialog"
        aria-modal="true"
        aria-label="Transfer ticket"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 shrink-0 rounded-full bg-white" aria-hidden="true" />

        <div className="scrollbar-none overflow-y-auto">
          {stage === 'loading' && (
            <div className="flex min-h-60 flex-col items-center justify-center gap-5" role="status" aria-label="Preparing transfer">
              <div className="relative size-12 animate-spin">
                <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white/80" />
                <span className="absolute inset-0 rotate-120 rounded-full border-4 border-transparent border-t-blue-accent border-r-blue-accent/80" />
                <span className="absolute inset-0 rotate-240 rounded-full border-4 border-transparent border-t-muted border-r-muted/80" />
              </div>
              <p className="text-sm text-muted-2">Preparing your transfer…</p>
            </div>
          )}

          {stage === 'auth' && (
            <div className="flex flex-col">
              <h3 className="mb-3.75 text-xl font-bold">Authenticate your account</h3>
              {/* <div className="mb-3.75 rounded-lg border border-blue-action/40 bg-blue-action/10 p-3.75 text-sm">
                <span className="text-muted-2">Demo code: </span>
                <span className="font-bold tracking-[3px] text-white">{code}</span>
              </div> */}
              <p className="mb-2.5 text-sm leading-normal text-muted-2">
                A one-time code has been sent to{' '}
                <span className="block font-semibold text-white">********1234</span>
              </p>
              <p className="mb-3.75 text-sm leading-normal text-muted-2">
                Please enter the code below to continue.
              </p>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="one-time code"
                value={enteredCode}
                onChange={(event) => setEnteredCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                aria-label="One-time code"
                className={`${inputClass} mb-2.5 tracking-[3px]`}
              />
              <p className="mb-5 text-xs text-muted">It may take a minute to receive your code.</p>
              <button
                type="button"
                disabled={enteredCode.length !== 6}
                className={`cursor-pointer rounded-lg border-0 font-bold ${enteredCode.length === 6 ? 'w-full bg-blue-action p-4 text-[15px] text-white' : 'mx-auto bg-transparent px-5 py-3 text-sm text-blue-accent'}`}
                onClick={() => setStage('select')}
              >
                Confirm code
              </button>
            </div>
          )}

          {stage === 'select' && (
            <div className="flex flex-col">
              <h3 className="mb-3.75 text-xl font-bold">Select ticket to transfer</h3>
              <div className="mb-5 flex gap-2.5 rounded-lg bg-surface p-3.75 text-[13px] leading-normal text-muted-2">
                <Info size={16} className="mt-0.5 shrink-0 text-blue-accent" aria-hidden="true" />
                <p>
                  Only transfer tickets to people you know and trust to ensure everyone stays safe
                  and socially distanced.
                </p>
              </div>
              <div className="mb-5 flex flex-col">
                <div className="mb-3.75 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">
                    SEC {ticket.variants[selectedSeats[0] ?? 0]?.section}, Row {ticket.variants[selectedSeats[0] ?? 0]?.row}
                  </span>
                  <span className="text-xs font-semibold text-muted-2">
                    {ticket.amount} ticket{ticket.amount === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {ticket.variants.map((variant, index) => (
                    <label key={index} className="flex cursor-pointer flex-col items-center gap-2">
                      <span className="flex h-7 w-24 items-center justify-center rounded-t-xl bg-blue-900 text-sm font-bold text-white">
                        Seat {variant.seat}
                      </span>
                      <input
                        type="checkbox"
                        name="transfer-seats"
                        checked={selectedSeats.includes(index)}
                        onChange={() =>
                          setSelectedSeats((current) =>
                            current.includes(index)
                              ? current.filter((seatIndex) => seatIndex !== index)
                              : [...current, index],
                          )
                        }
                        aria-label={`Seat ${variant.seat}`}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex size-5 items-center justify-center rounded-full border-2 transition-colors ${selectedSeats.includes(index) ? 'border-blue-900 bg-blue-900' : 'border-[#555555]'} peer-focus-visible:ring-2 peer-focus-visible:ring-blue-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-2`}
                      >
                        {selectedSeats.includes(index) && (
                          <Check size={12} strokeWidth={3} className="text-white" />
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 mt-12">
                
                <span className="text-sm font-semibold text-muted-2">
                  {selectedSeats.length} selected
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 cursor-pointer border-0 bg-transparent p-0 text-sm font-bold uppercase tracking-wide text-blue-800"
                  onClick={() => setStage('recipient')}
                >
                  Transfer to  <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          )}

          {stage === 'recipient' && (
            <form className="flex flex-col" onSubmit={handleSend}>
              <div className="mb-5 p-3.75 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">{selectedSeats.length} Tickets Selected</span>
                </div>
                {selectedSummary && (
                  <p className="mt-1 text-sm font-semibold text-muted-2">{selectedSummary}</p>
                )}
              </div>
              <label className="mt-large block">
                <span className="mb-1 block text-xs font-semibold text-muted">First name</span>
                <input
                  type="text"
                  placeholder="e.g. John"
                  autoComplete="off"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="mt-large block">
                <span className="mb-1 block text-xs font-semibold text-muted">Last name</span>
                <input
                  type="text"
                  placeholder="e.g. Doe"
                  autoComplete="off"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="mt-large block">
                <span className="mb-1 block text-xs font-semibold text-muted">Email</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="off"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="mt-large block">
                <span className="mb-1 block text-xs font-semibold text-muted">Note</span>
                <input
                  type="text"
                  placeholder="Optional message"
                  autoComplete="off"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className={inputClass}
                />
              </label>
              <div className="mt-large flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-sm font-semibold text-white"
                  onClick={() => setStage('select')}
                >
                  <ChevronLeft size={16} className="text-white" aria-hidden="true" />
                  Back
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg border-0 bg-black px-3 py-2 text-sm font-bold text-white shadow-lg shadow-black/40"
                >
                  transfer {selectedSeats.length} tickets
                </button>
              </div>
            </form>
          )}

          {stage === 'success' && (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-[#22c55e]/15 text-[#22c55e]">
                <Check size={24} aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold">Transfer sent</h3>
              <p className="mt-2.5 text-sm leading-[1.5] text-muted-2">
                Your ticket has been transferred to {firstName || 'your recipient'}
                {email ? ` (${email})` : ''}.
              </p>
              <button
                type="button"
                className="mt-6 w-full cursor-pointer rounded-lg border-0 bg-blue-action p-4 text-[15px] font-bold text-white"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

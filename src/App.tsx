import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { LocationSheet } from './components/LocationSheet'
import { PwaStatus } from './components/PwaStatus'
import { TransferSheet } from './components/TransferSheet'
import { listTickets, removeTicket, saveTicket } from './db'
import { defaultDraft, getDefaultDraft, getEventsForLocation, localizeLocation } from './data'
import { fetchAppActive } from './lib/appStatus'
import {
  loadFavourites,
  loadLocation,
  loadReceiptSettings,
  loadSampleHidden,
  saveFavourites,
  saveLocation,
  saveReceiptSettings,
  saveSampleHidden,
} from './lib/storage'
import type {
  EventItem,
  GeneratorDraft,
  LocationOption,
  ReceiptSettings,
  Ticket,
  TicketVariant,
  View,
} from './types'
import { AccountView } from './views/AccountView'
import { BarcodeView } from './views/BarcodeView'
import { HomeView } from './views/HomeView'
import { MyTicketsView } from './views/MyTicketsView'
import { OrderDetailsView } from './views/OrderDetailsView'
import { ReceiptPage } from './views/ReceiptPage'
import { WatchlistView } from './views/WatchlistView'

function createId() {
  return `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

type AppStatus = 'checking' | 'active' | 'blocked'

const textFields = ['event', 'loc', 'date', 'doors', 'holder', 'image', 'price'] as const

function completeDraft(draft: GeneratorDraft): GeneratorDraft {
  const result = { ...draft }
  for (const key of textFields) {
    result[key] = draft[key].trim() || defaultDraft[key]
  }

  const amount = Math.max(1, Math.min(50, parseInt(draft.amount, 10) || 1))
  const source = draft.variants.length ? draft.variants : defaultDraft.variants
  const fallback = defaultDraft.variants[0]

  result.amount = String(amount)
  result.variants = Array.from({ length: amount }, (_, index) => {
    const entry = source[index] ?? source[source.length - 1] ?? fallback
    return {
      section: entry.section.trim() || fallback.section,
      row: entry.row.trim() || fallback.row,
      seat: entry.seat.trim() || fallback.seat,
      entrance: entry.entrance.trim() || fallback.entrance,
    }
  })

  return result
}

export default function App() {
  // While online the first paint waits for the kill-switch check so a disabled
  // app never flashes its normal UI. Offline starts stay usable immediately.
  const [status, setStatus] = useState<AppStatus>(() =>
    navigator.onLine ? 'checking' : 'active',
  )
  const [view, setView] = useState<View>('home')
  const tickets = useLiveQuery(() => listTickets(), [], []) ?? []
  const [sampleVisible, setSampleVisible] = useState(() => !loadSampleHidden())
  const [favourites, setFavourites] = useState<string[]>(loadFavourites)
  const [location, setLocation] = useState<LocationOption>(loadLocation)
  const [locationOpen, setLocationOpen] = useState(false)
  const [draft, setDraft] = useState<GeneratorDraft>(() => getDefaultDraft(location))
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>(loadReceiptSettings)
  const [orderTicket, setOrderTicket] = useState<Ticket | null>(null)
  const [barcodeOpen, setBarcodeOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)

  useEffect(() => saveSampleHidden(!sampleVisible), [sampleVisible])
  useEffect(() => saveFavourites(favourites), [favourites])
  useEffect(() => saveReceiptSettings(receiptSettings), [receiptSettings])
  useEffect(() => saveLocation(location), [location])

  useEffect(() => {
    let cancelled = false
    let requestId = 0

    async function checkStatus() {
      if (!navigator.onLine) return
      const currentRequest = ++requestId
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 4000)

      try {
        const active = await fetchAppActive(controller.signal)
        if (cancelled || currentRequest !== requestId) return
        if (active === false) setStatus('blocked')
        else if (active === true) setStatus('active')
        else setStatus((current) => (current === 'checking' ? 'active' : current))
      } catch {
        if (!cancelled && currentRequest === requestId) {
          setStatus((current) => (current === 'checking' ? 'active' : current))
        }
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void checkStatus()

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void checkStatus()
    }
    const onShow = () => void checkStatus()

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pageshow', onShow)
    window.addEventListener('online', onShow)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pageshow', onShow)
      window.removeEventListener('online', onShow)
    }
  }, [])

  const events = useMemo(() => getEventsForLocation(location), [location])
  const favouriteEvents = useMemo(
    () => events.allEvents.filter((event) => favourites.includes(event.id)),
    [events, favourites],
  )

  function changeView(nextView: View) {
    setView(nextView)
    closeOverlays()
  }

  function closeOverlays() {
    setOrderTicket(null)
    setBarcodeOpen(false)
    setReceiptOpen(false)
    setTransferOpen(false)
    setLocationOpen(false)
  }

  function selectEvent(event: EventItem) {
    setDraft((current) => ({
      ...current,
      event: event.title,
      loc: event.location,
      date: event.date,
      image: event.image,
    }))
    setView('account')
  }

  function selectLocation(next: LocationOption) {
    setLocation(next)
    setDraft((current) => ({ ...current, loc: localizeLocation(defaultDraft.loc, next) }))
  }

  function toggleFavourite(id: string) {
    setFavourites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function updateDraft(field: keyof GeneratorDraft, value: string) {
    setDraft((current) => {
      if (field !== 'amount') return { ...current, [field]: value }

      const amount = Math.max(1, Math.min(50, parseInt(value, 10) || 1))
      return {
        ...current,
        amount: String(amount),
        variants: Array.from(
          { length: amount },
          (_, index) => current.variants[index] ?? { ...defaultDraft.variants[0] },
        ),
      }
    })
  }

  function updateVariant(index: number, field: keyof TicketVariant, value: string) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry,
      ),
    }))
  }

  function updateReceiptSetting(field: keyof ReceiptSettings, value: string) {
    setReceiptSettings((current) => ({ ...current, [field]: value }))
  }

  async function generateTicket() {
    const details = completeDraft(draft)
    const ticket: Ticket = {
      id: createId(),
      event: details.event,
      loc: details.loc,
      date: details.date,
      doors: details.doors,
      holder: details.holder,
      image: details.image,
      price: Math.max(0, Number(details.price) || 0),
      amount: Number(details.amount),
      variants: details.variants,
      orderNum: Math.floor(10000000 + Math.random() * 90000000),
    }

    await saveTicket(ticket)
    setView('mytickets')
    closeOverlays()
  }

  async function deleteTicket(id: string) {
    await removeTicket(id)
  }

  if (status === 'checking') return null
  if (status === 'blocked') return <>contact admin</>

  return (
    <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-surface pt-[env(safe-area-inset-top)] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      {view === 'home' && (
        <HomeView
          location={location}
          favourites={favourites}
          onSelectEvent={selectEvent}
          onToggleFavourite={toggleFavourite}
          onChangeLocation={() => setLocationOpen(true)}
        />
      )}

      {view === 'watchlist' && (
        <WatchlistView
          favouriteEvents={favouriteEvents}
          onSelectEvent={selectEvent}
          onRemoveFavourite={toggleFavourite}
        />
      )}

      {view === 'mytickets' && (
        <MyTicketsView
          location={location}
          tickets={tickets}
          sampleVisible={sampleVisible}
          onOpenOrder={setOrderTicket}
          onDeleteTicket={deleteTicket}
          onDeleteSample={() => setSampleVisible(false)}
        />
      )}

      {view === 'account' && (
        <AccountView
          location={location}
          draft={draft}
          receiptSettings={receiptSettings}
          onChange={updateDraft}
          onVariantChange={updateVariant}
          onReceiptSettingChange={updateReceiptSetting}
          onGenerate={generateTicket}
        />
      )}

      {orderTicket && (
        <OrderDetailsView
          key={orderTicket.id}
          ticket={orderTicket}
          onClose={() => setOrderTicket(null)}
          onViewTickets={() => setBarcodeOpen(true)}
          onViewReceipt={() => setReceiptOpen(true)}
          onTransfer={() => setTransferOpen(true)}
        />
      )}

      {orderTicket && barcodeOpen && (
        <BarcodeView
          key={orderTicket.id}
          ticket={orderTicket}
          onClose={() => setBarcodeOpen(false)}
        />
      )}

      {orderTicket && receiptOpen && (
        <ReceiptPage
          key={orderTicket.id}
          ticket={orderTicket}
          settings={receiptSettings}
          onClose={() => setReceiptOpen(false)}
        />
      )}

      {orderTicket && transferOpen && (
        <TransferSheet ticket={orderTicket} onClose={() => setTransferOpen(false)} />
      )}

      {locationOpen && (
        <LocationSheet
          current={location}
          onSelect={selectLocation}
          onClose={() => setLocationOpen(false)}
        />
      )}

      <PwaStatus />

      {!orderTicket && <BottomNav active={view} onChange={changeView} />}
    </div>
  )
}
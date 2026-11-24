import { defaultLocation, defaultReceiptSettings } from '../data'
import type { LocationOption, ReceiptSettings, Ticket } from '../types'

const TICKETS_KEY = 'ticketzmaster.tickets'
const SAMPLE_HIDDEN_KEY = 'ticketzmaster.sampleHidden'
const FAVOURITES_KEY = 'ticketzmaster.favourites'
const RECEIPT_SETTINGS_KEY = 'ticketzmaster.receiptSettings'
const LOCATION_KEY = 'ticketzmaster.location'

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage can be unavailable (private mode, quota) */
  }
}

/** Older saved tickets predate batches; give them a single seat entry. */
type StoredTicket = Ticket & {
  price?: number
  section?: string
  row?: string
  seat?: string
  entrance?: string
}

function normalizeTicket(stored: StoredTicket): Ticket {
  const amount = Math.max(1, stored.amount || 1)
  const variants = stored.variants?.length
    ? stored.variants
    : [
        {
          section: stored.section ?? '',
          row: stored.row ?? '',
          seat: stored.seat ?? '',
          entrance: stored.entrance ?? '',
        },
      ]

  return {
    ...stored,
    price: stored.price ?? 0,
    amount,
    variants: Array.from({ length: amount }, (_, index) => variants[index] ?? variants[variants.length - 1]),
  }
}

/** Tickets written by the pre-Dexie build, used only for the one-time import. */
export const loadLegacyTickets = () =>
  read<StoredTicket[]>(TICKETS_KEY, []).map(normalizeTicket)

export const clearLegacyTickets = () => {
  try {
    localStorage.removeItem(TICKETS_KEY)
  } catch {
    /* storage can be unavailable (private mode, quota) */
  }
}

export const loadSampleHidden = () => read<boolean>(SAMPLE_HIDDEN_KEY, false)
export const saveSampleHidden = (hidden: boolean) => write(SAMPLE_HIDDEN_KEY, hidden)

export const loadFavourites = () => read<string[]>(FAVOURITES_KEY, [])
export const saveFavourites = (ids: string[]) => write(FAVOURITES_KEY, ids)

export const loadReceiptSettings = (): ReceiptSettings => {
  const stored = read<Partial<ReceiptSettings>>(RECEIPT_SETTINGS_KEY, {})
  return {
    facilityCharge: stored.facilityCharge ?? defaultReceiptSettings.facilityCharge,
    serviceFee: stored.serviceFee ?? defaultReceiptSettings.serviceFee,
    delivery: stored.delivery?.trim() || defaultReceiptSettings.delivery,
  }
}

export const saveReceiptSettings = (settings: ReceiptSettings) =>
  write(RECEIPT_SETTINGS_KEY, settings)

export const loadLocation = () => read<LocationOption>(LOCATION_KEY, defaultLocation)
export const saveLocation = (location: LocationOption) => write(LOCATION_KEY, location)

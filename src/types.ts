export type View = 'home' | 'watchlist' | 'mytickets' | 'account'

/** A selectable demo location. */
export interface LocationOption {
  id: string
  city: string
  /** Short label shown in the home header, e.g. "Los Angeles, CA". */
  label: string
  /** Full location shown on the right of the picker rows. */
  exact: string
  flag: string
}

export interface EventItem {
  id: string
  title: string
  location: string
  /** Local ISO datetime, e.g. "2024-06-22T20:00". */
  date: string
  image: string
  category?: string
}

/** Editable receipt values, kept as strings so they can be typed directly. */
export interface ReceiptSettings {
  facilityCharge: string
  serviceFee: string
  delivery: string
}

/** Seat details for one ticket within a batch. */
export interface TicketVariant {
  section: string
  row: string
  seat: string
  entrance: string
}

export interface Ticket {
  id: string
  event: string
  loc: string
  /** Local ISO datetime, e.g. "2027-05-21T20:00". */
  date: string
  /** Doors-open time, "HH:mm". */
  doors: string
  holder: string
  orderNum: number
  image: string
  /** Price per ticket, in whole currency units. */
  price: number
  /** Number of tickets in this batch, as set in the generator. */
  amount: number
  /** One entry per ticket in the batch. */
  variants: TicketVariant[]
}

export interface GeneratorDraft extends Omit<Ticket, 'id' | 'orderNum' | 'amount' | 'price'> {
  /** Kept as strings so they can be typed straight into number inputs. */
  amount: string
  price: string
}

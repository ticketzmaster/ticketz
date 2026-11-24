import Dexie, { type EntityTable } from 'dexie'
import type { Ticket } from '../types'

/**
 * Single browser-only database. Dexie is only imported by client code, so there
 * are no server-side boundaries to guard in this Vite SPA.
 */
export const db = new Dexie('ticketzmaster') as Dexie & {
  tickets: EntityTable<Ticket, 'id'>
}

// Primary key is the generated ticket id; the other indexes cover the list and
// lookup queries used by My Tickets and the detail screens.
db.version(1).stores({
  tickets: 'id, date, orderNum',
})

/** Newest events first, so the upcoming list starts with the next event. */
export function listTickets(): Promise<Ticket[]> {
  return db.tickets.orderBy('date').reverse().toArray()
}

export function getTicket(id: string): Promise<Ticket | undefined> {
  return db.tickets.get(id)
}

export function saveTicket(ticket: Ticket): Promise<string> {
  return db.tickets.put(ticket)
}

export function removeTicket(id: string): Promise<void> {
  return db.tickets.delete(id)
}

/** Idempotent one-time import from the old localStorage ticket store. */
export async function importLegacyTickets(tickets: Ticket[]): Promise<void> {
  if (tickets.length === 0) return
  await db.tickets.bulkPut(tickets)
}

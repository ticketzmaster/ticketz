import { differenceInCalendarDays, format, isValid, parse, parseISO } from 'date-fns'

/** Parses a ticket date: ISO ("2027-05-21T20:00") or legacy "FRI • MAY 21, 2027 • 8:00 PM". */
export function parseTicketDate(date: string): Date | null {
  const iso = parseISO(date)
  if (isValid(iso)) return iso

  // Legacy format kept for tickets saved before the ISO refactor.
  const parts = date.split('•')
  if (parts.length < 2) return null

  const datePart = parts[1].trim()
  const timePart = parts.length > 2 ? parts[2].trim() : '12:00 PM'
  const parsed = parse(`${datePart} ${timePart}`, 'MMM d, yyyy h:mm a', new Date())

  return isValid(parsed) ? parsed : null
}

/** Whole days from today until the closest upcoming ticket date. */
export function daysUntilNextTicket(dates: Date[]): number {
  const today = new Date()

  let closest = Number.POSITIVE_INFINITY
  for (const date of dates) {
    const diff = differenceInCalendarDays(date, today)
    if (diff >= 0 && diff < closest) closest = diff
  }

  return closest === Number.POSITIVE_INFINITY ? 0 : closest
}

/** "SAT • JUN 22, 2024 • 8:00 PM" — the ticket-card date line. */
export function displayTicketDate(date: string): string {
  const parsed = parseTicketDate(date)
  return parsed ? format(parsed, 'EEE • MMM d, yyyy • h:mm a').toUpperCase() : date
}

/** "Saturday • 8:00 PM" — weekday + time for event cards. */
export function displayDateTime(date: string): string {
  const parsed = parseTicketDate(date)
  return parsed ? format(parsed, 'EEEE • h:mm a') : 'TBA'
}

/** "17:30" -> "5:30 PM". */
export function displayDoorsTime(doors: string): string {
  const parsed = parse(doors, 'HH:mm', new Date())
  return isValid(parsed) ? format(parsed, 'h:mm a') : doors
}

/** "OASIS" -> "Oasis" */
export const sentenceCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
/** Gist kill switch. `null` means "could not check" and callers should keep the last known state. */
export const STATUS_URL =
  'https://gist.githubusercontent.com/ticketzmaster/85f74ee12e889c420f5e394017e5afd1/raw/gistfile1.txt'

export async function fetchAppActive(signal?: AbortSignal): Promise<boolean | null> {
  // A unique query defeats the gist CDN's 5-minute cache; no-store keeps the
  // browser and service worker out of the way as well.
  const url = new URL(STATUS_URL)
  url.searchParams.set('_', Date.now().toString())

  const response = await fetch(url, {
    cache: 'no-store',
    credentials: 'omit',
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) return null

  const payload: unknown = await response.json()
  if (typeof payload !== 'object' || payload === null) return null

  const active = (payload as { active?: unknown }).active
  return typeof active === 'boolean' ? active : null
}

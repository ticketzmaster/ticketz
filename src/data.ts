import type { EventItem, GeneratorDraft, LocationOption, ReceiptSettings, Ticket } from './types'

const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=95&w=${width}`

export const OASIS_IMAGE = unsplash('photo-1470229722913-7c0e2dbbafd3', 1400)

const makeLocation = (
  id: string,
  city: string,
  label: string,
  exact: string,
  flag: string,
): LocationOption => ({ id, city, label, exact, flag })

export const defaultLocation = makeLocation(
  'los-angeles',
  'Los Angeles',
  'Los Angeles, CA',
  'US, California, Los Angeles',
  '🇺🇸',
)

export const recentLocations: LocationOption[] = [
  makeLocation('london', 'London', 'London, UK', 'UK, England, London', '🇬🇧'),
  makeLocation('new-york', 'New York City', 'New York, NY', 'US, New York, New York City', '🇺🇸'),
  makeLocation('mexico-city', 'Mexico City', 'Mexico City, MX', 'MX, CDMX, Mexico City', '🇲🇽'),
  makeLocation('toronto', 'Toronto', 'Toronto, ON', 'CA, Ontario, Toronto', '🇨🇦'),
]

// Reuse the same shape for the popular list rather than hand-writing each entry.
const popularData: Array<[string, string, string, string, string]> = [
  ['los-angeles', 'Los Angeles', 'Los Angeles, CA', 'US, California, Los Angeles', '🇺🇸'],
  ['paris', 'Paris', 'Paris, FR', 'FR, Île-de-France, Paris', '🇫🇷'],
  ['tokyo', 'Tokyo', 'Tokyo, JP', 'JP, Tokyo, Tokyo', '🇯🇵'],
  ['berlin', 'Berlin', 'Berlin, DE', 'DE, Berlin, Berlin', '🇩🇪'],
  ['madrid', 'Madrid', 'Madrid, ES', 'ES, Madrid, Madrid', '🇪🇸'],
  ['rome', 'Rome', 'Rome, IT', 'IT, Lazio, Rome', '🇮🇹'],
  ['sydney', 'Sydney', 'Sydney, AU', 'AU, New South Wales, Sydney', '🇦🇺'],
  ['seoul', 'Seoul', 'Seoul, KR', 'KR, Seoul, Seoul', '🇰🇷'],
  ['amsterdam', 'Amsterdam', 'Amsterdam, NL', 'NL, North Holland, Amsterdam', '🇳🇱'],
  ['sao-paulo', 'São Paulo', 'São Paulo, BR', 'BR, São Paulo, São Paulo', '🇧🇷'],
  ['dubai', 'Dubai', 'Dubai, AE', 'AE, Dubai, Dubai', '🇦🇪'],
  ['singapore', 'Singapore', 'Singapore, SG', 'SG, Singapore, Singapore', '🇸🇬'],
]

export const popularLocations: LocationOption[] = popularData.map((entry) =>
  makeLocation(...entry),
)

export const featuredEvents: EventItem[] = [
  {
    id: 'teddy-swims',
    title: 'TEDDY SWIMS',
    location: 'Various, Los Angeles, CA',
    date: '2024-06-22T20:00',
    image: unsplash('photo-1459749411175-04bf5292ceea', 1400),
    category: 'Concerts',
  },
  {
    id: 'future-metro',
    title: 'FUTURE & METRO',
    location: 'Crypto.com Arena, LA',
    date: '2024-07-15T20:00',
    image: unsplash('photo-1516450360452-9312f5e86fc7', 1400),
    category: 'Concerts',
  },
  {
    id: 'billie-eilish',
    title: 'BILLIE EILISH',
    location: 'Kia Forum, Inglewood',
    date: '2024-08-05T19:30',
    image: unsplash('photo-1470229722913-7c0e2dbbafd3', 1400),
    category: 'Concerts',
  },
]

export const trendingEvents: EventItem[] = [
  {
    id: 'trans-siberian-orchestra',
    title: 'Trans-Siberian Orchestra',
    location: 'Madison Square Garden, NY',
    date: '2024-12-15T19:00',
    image: unsplash('photo-1511671782779-c97d3d27a1d4', 1400),
    category: 'Concerts',
  },
  {
    id: 'don-omar',
    title: 'Don Omar',
    location: 'Crypto.com Arena, LA',
    date: '2024-08-10T21:00',
    image: unsplash('photo-1501386761578-eac5c94b800a', 1400),
    category: 'Concerts',
  },
  {
    id: 'oasis',
    title: 'Oasis',
    location: 'Celtic Park, Glasgow, UK',
    date: '2027-05-21T20:00',
    image: OASIS_IMAGE,
    category: 'Concerts',
  },
  {
    id: 'bad-bunny',
    title: 'Bad Bunny',
    location: 'SoFi Stadium, LA',
    date: '2024-10-05T20:00',
    image: unsplash('photo-1459749411175-04bf5292ceea', 1400),
    category: 'Concerts',
  },
  {
    id: 'zach-bryan',
    title: 'Zach Bryan',
    location: 'The Kia Forum, Inglewood',
    date: '2024-11-12T19:00',
    image: unsplash('photo-1493225457124-a1a2a4c7e2c9', 1400),
    category: 'Concerts',
  },
  {
    id: 'the-weeknd',
    title: 'The Weeknd',
    location: 'SoFi Stadium, LA',
    date: '2024-11-02T20:00',
    image: unsplash('photo-1514525253161-7a46d19cd819', 1400),
    category: 'Concerts',
  },
]

export const recommendedEvent: EventItem = {
  id: 'arctic-monkeys',
  title: 'ARCTIC MONKEYS',
  location: 'The Kia Forum, Inglewood',
  date: '2024-09-12T20:00',
  image: unsplash('photo-1470229722913-7c0e2dbbafd3', 1400),
  category: 'Concerts',
}

export const allEvents: EventItem[] = [
  ...featuredEvents,
  ...trendingEvents,
  recommendedEvent,
]

interface LocationSampleSet {
  featured: EventItem[]
  trending: EventItem[]
  recommended: EventItem
}

const sampleEvent = (
  id: string,
  title: string,
  location: string,
  date: string,
  imageId: string,
): EventItem => ({
  id,
  title,
  location,
  date,
  image: unsplash(imageId, 1400),
  category: 'Concerts',
})

/** Distinct demo events per recent location, so switching cities changes the home data. */
const locationSamples: Record<string, LocationSampleSet> = {
  london: {
    featured: [
      sampleEvent('ldn-adele', 'ADELE', 'The O2 Arena, London', '2024-09-21T20:00', 'photo-1459749411175-04bf5292ceea'),
      sampleEvent('ldn-coldplay', 'COLDPLAY', 'Wembley Stadium, London', '2024-08-18T19:00', 'photo-1514525253161-7a46d19cd819'),
      sampleEvent('ldn-dua-lipa', 'DUA LIPA', 'Hyde Park, London', '2024-07-06T19:30', 'photo-1470229722913-7c0e2dbbafd3'),
    ],
    trending: [
      sampleEvent('ldn-stormzy', 'STORMZY', 'The O2 Arena, London', '2024-10-04T20:00', 'photo-1501386761578-eac5c94b800a'),
      sampleEvent('ldn-sam-fender', 'SAM FENDER', 'Wembley Stadium, London', '2024-11-16T19:00', 'photo-1493225457124-a1a2a4c7e2c9'),
      sampleEvent('ldn-little-simz', 'LITTLE SIMZ', 'Eventim Apollo, London', '2024-12-02T20:00', 'photo-1511671782779-c97d3d27a1d4'),
      sampleEvent('ldn-ed-sheeran', 'ED SHEERAN', 'Wembley Stadium, London', '2025-01-18T19:00', 'photo-1516450360452-9312f5e86fc7'),
      sampleEvent('ldn-raye', 'RAYE', 'O2 Academy Brixton, London', '2025-02-08T20:00', 'photo-1459749411175-04bf5292ceea'),
      sampleEvent('ldn-gorillaz', 'GORILLAZ', 'The O2 Arena, London', '2025-03-15T20:00', 'photo-1514525253161-7a46d19cd819'),
    ],
    recommended: sampleEvent('ldn-elton-john', 'ELTON JOHN', 'Odeon Luxe Leicester Square, London', '2025-04-12T20:00', 'photo-1470229722913-7c0e2dbbafd3'),
  },
  'new-york': {
    featured: [
      sampleEvent('nyc-taylor-swift', 'TAYLOR SWIFT', 'Madison Square Garden, New York', '2024-10-18T20:00', 'photo-1459749411175-04bf5292ceea'),
      sampleEvent('nyc-the-weeknd', 'THE WEEKND', 'Barclays Center, Brooklyn', '2024-11-09T20:00', 'photo-1514525253161-7a46d19cd819'),
      sampleEvent('nyc-billie-eilish', 'BILLIE EILISH', 'Radio City Music Hall, New York', '2024-12-06T19:30', 'photo-1470229722913-7c0e2dbbafd3'),
    ],
    trending: [
      sampleEvent('nyc-jay-z', 'JAY-Z', 'Barclays Center, Brooklyn', '2025-01-25T20:00', 'photo-1501386761578-eac5c94b800a'),
      sampleEvent('nyc-sza', 'SZA', 'Madison Square Garden, New York', '2025-02-14T20:00', 'photo-1493225457124-a1a2a4c7e2c9'),
      sampleEvent('nyc-jon-batiste', 'JON BATISTE', 'Beacon Theatre, New York', '2025-03-03T20:00', 'photo-1511671782779-c97d3d27a1d4'),
      sampleEvent('nyc-beyonce', 'BEYONCÉ', 'MetLife Stadium, New York', '2025-04-19T19:00', 'photo-1516450360452-9312f5e86fc7'),
      sampleEvent('nyc-bad-bunny', 'BAD BUNNY', 'Madison Square Garden, New York', '2025-05-10T20:00', 'photo-1459749411175-04bf5292ceea'),
      sampleEvent('nyc-harry-styles', 'HARRY STYLES', 'Madison Square Garden, New York', '2025-06-07T19:30', 'photo-1514525253161-7a46d19cd819'),
    ],
    recommended: sampleEvent('nyc-bruce-springsteen', 'BRUCE SPRINGSTEEN', 'Madison Square Garden, New York', '2025-07-12T20:00', 'photo-1470229722913-7c0e2dbbafd3'),
  },
  'mexico-city': {
    featured: [
      sampleEvent('mex-bad-bunny', 'BAD BUNNY', 'Estadio Azteca, Mexico City', '2024-10-12T20:00', 'photo-1459749411175-04bf5292ceea'),
      sampleEvent('mex-karol-g', 'KAROL G', 'Auditorio Nacional, Mexico City', '2024-11-23T20:00', 'photo-1516450360452-9312f5e86fc7'),
      sampleEvent('mex-grupo-frontera', 'GRUPO FRONTERA', 'Estadio GNP, Mexico City', '2024-12-14T19:00', 'photo-1470229722913-7c0e2dbbafd3'),
    ],
    trending: [
      sampleEvent('mex-peso-pluma', 'PESO PLUMA', 'Estadio Azteca, Mexico City', '2025-01-18T20:00', 'photo-1501386761578-eac5c94b800a'),
      sampleEvent('mex-mon-laurent', 'MON LAURENT', 'Auditorio Nacional, Mexico City', '2025-02-08T20:00', 'photo-1493225457124-a1a2a4c7e2c9'),
      sampleEvent('mex-ca7riel-paco', 'CA7RIEL & PACO AMOROSO', 'Pepsi Center, Mexico City', '2025-03-15T20:00', 'photo-1511671782779-c97d3d27a1d4'),
      sampleEvent('mex-luis-miguel', 'LUIS MIGUEL', 'Auditorio Nacional, Mexico City', '2025-04-05T20:00', 'photo-1514525253161-7a46d19cd819'),
      sampleEvent('mex-natanael-cano', 'NATANAEL CANO', 'Estadio GNP, Mexico City', '2025-05-24T19:00', 'photo-1459749411175-04bf5292ceea'),
      sampleEvent('mex-shakira', 'SHAKIRA', 'Estadio Azteca, Mexico City', '2025-06-14T20:00', 'photo-1516450360452-9312f5e86fc7'),
    ],
    recommended: sampleEvent('mex-julion', 'JULIÓN', 'Auditorio Nacional, Mexico City', '2025-07-19T20:00', 'photo-1470229722913-7c0e2dbbafd3'),
  },
  toronto: {
    featured: [
      sampleEvent('tor-drake', 'DRAKE', 'Scotiabank Arena, Toronto', '2024-10-26T20:00', 'photo-1459749411175-04bf5292ceea'),
      sampleEvent('tor-the-weeknd', 'THE WEEKND', 'Rogers Centre, Toronto', '2024-11-16T20:00', 'photo-1514525253161-7a46d19cd819'),
      sampleEvent('tor-tate-mcrae', 'TATE McRAE', 'Scotiabank Arena, Toronto', '2024-12-07T19:30', 'photo-1470229722913-7c0e2dbbafd3'),
    ],
    trending: [
      sampleEvent('tor-david-guetta', 'DAVID GUETTA', 'Rogers Centre, Toronto', '2025-01-24T20:00', 'photo-1501386761578-eac5c94b800a'),
      sampleEvent('tor-shubh', 'SHUBH', 'Coca-Cola Coliseum, Toronto', '2025-02-15T20:00', 'photo-1493225457124-a1a2a4c7e2c9'),
      sampleEvent('tor-northside-boys', 'NORTHSIDE BOYS', 'History, Toronto', '2025-03-08T20:00', 'photo-1511671782779-c97d3d27a1d4'),
      sampleEvent('tor-justin-bieber', 'JUSTIN BIEBER', 'Scotiabank Arena, Toronto', '2025-04-11T19:00', 'photo-1516450360452-9312f5e86fc7'),
      sampleEvent('tor-charli-xcx', 'CHARLI XCX', 'Massey Hall, Toronto', '2025-05-17T20:00', 'photo-1459749411175-04bf5292ceea'),
      sampleEvent('tor-arcade-fire', 'ARCADE FIRE', 'Rogers Centre, Toronto', '2025-06-21T20:00', 'photo-1514525253161-7a46d19cd819'),
    ],
    recommended: sampleEvent('tor-jessie-ware', 'JESSIE WARE', 'Massey Hall, Toronto', '2025-07-05T20:00', 'photo-1470229722913-7c0e2dbbafd3'),
  },
}

/** Replaces the city in a demo location string with the selected one. */
export const localizeLocation = (template: string, location: LocationOption) =>
  `${template.split(',')[0]}, ${location.city}`

/** Use location-specific samples when available, otherwise localize the generic demo set. */
export function getEventsForLocation(location: LocationOption) {
  const samples = locationSamples[location.id]
  if (samples) {
    return {
      featured: samples.featured,
      trending: samples.trending,
      recommended: samples.recommended,
      allEvents: [...samples.featured, ...samples.trending, samples.recommended],
    }
  }

  const localize = (event: EventItem): EventItem => ({
    ...event,
    location: localizeLocation(event.location, location),
  })

  const featured = featuredEvents.map(localize)
  const trending = trendingEvents.map(localize)
  const recommended = localize(recommendedEvent)

  return {
    featured,
    trending,
    recommended,
    allEvents: [...featured, ...trending, recommended],
  }
}

export function getDefaultDraft(location: LocationOption): GeneratorDraft {
  return { ...defaultDraft, loc: localizeLocation(defaultDraft.loc, location) }
}

export function getSampleTicket(location: LocationOption): Ticket {
  return { ...sampleTicket, loc: localizeLocation(sampleTicket.loc, location) }
}

export const defaultReceiptSettings: ReceiptSettings = {
  facilityCharge: '4.56',
  serviceFee: '11',
  delivery: 'Free',
}

export const defaultDraft: GeneratorDraft = {
  event: 'OASIS',
  loc: 'Celtic Park, Glasgow, UK',
  date: '2027-05-21T20:00',
  price: '45',
  amount: '1',
  variants: [{ section: '12', row: 'R', seat: '1', entrance: 'Gate A' }],
  doors: '16:00',
  holder: 'Moreno',
  image: OASIS_IMAGE,
}

export const sampleTicket: Ticket = {
  id: 'sample-oasis',
  event: 'OASIS',
  loc: 'Celtic Park, Glasgow, UK',
  date: '2027-05-21T20:00',
  price: 45,
  amount: 1,
  variants: [{ section: '12', row: 'R', seat: '1', entrance: 'Gate C' }],
  doors: '17:30',
  holder: 'Moreno',
  orderNum: 71898194,
  image: OASIS_IMAGE,
}
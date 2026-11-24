import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import '@fontsource-variable/inter'
import App from './App'
import { importLegacyTickets } from './db'
import { clearLegacyTickets, loadLegacyTickets } from './lib/storage'
import './index.css'

registerSW({ immediate: true })

// Move tickets saved by older builds into IndexedDB. bulkPut is idempotent, so
// a retry after an interrupted launch cannot duplicate tickets.
void (async () => {
  const legacy = loadLegacyTickets()
  if (legacy.length === 0) return
  try {
    await importLegacyTickets(legacy)
    clearLegacyTickets()
  } catch {
    // Keep the old copy so the import can be retried on the next launch.
  }
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

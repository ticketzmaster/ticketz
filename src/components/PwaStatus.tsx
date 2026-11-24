import { Download, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Small connection/install status pills, kept out of the main content flow. */
export function PwaStatus() {
  const [offline, setOffline] = useState(() => !navigator.onLine)
  const [canInstall, setCanInstall] = useState(false)
  const installEvent = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const onOffline = () => setOffline(true)
    const onOnline = () => setOffline(false)
    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    return () => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      installEvent.current = event as BeforeInstallPromptEvent
      setCanInstall(true)
    }
    const onInstalled = () => {
      installEvent.current = null
      setCanInstall(false)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function install() {
    const event = installEvent.current
    if (!event) return
    await event.prompt()
    await event.userChoice
    installEvent.current = null
    setCanInstall(false)
  }

  if (!offline && !canInstall) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--nav-height)+12px)] z-900 flex flex-col items-center gap-2 px-5">
      {offline && (
        <span className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#1f2937] px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
          <WifiOff size={14} className="text-yellow-400" aria-hidden="true" />
          Offline · saved on this device
        </span>
      )}
      {canInstall && (
        <button
          type="button"
          onClick={install}
          className="pointer-events-auto flex cursor-pointer items-center gap-2 rounded-full bg-blue-action px-3.5 py-2 text-xs font-bold text-white shadow-lg"
        >
          <Download size={14} aria-hidden="true" />
          Install app
        </button>
      )}
    </div>
  )
}

import { Trash2 } from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'

const LONG_PRESS_MS = 550

interface LongPressDeleteProps {
  onDelete: () => void
  children: ReactNode
}

/** Hold a ticket card to open a confirmation dialog instead of swiping. */
export function LongPressDelete({ onDelete, children }: LongPressDeleteProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const timer = useRef<number | null>(null)
  const longPressed = useRef(false)

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
  }, [])

  function cancelPress() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    longPressed.current = false
    cancelPress()
    timer.current = window.setTimeout(() => {
      longPressed.current = true
      setConfirmOpen(true)
      if (navigator.vibrate) navigator.vibrate(30)
    }, LONG_PRESS_MS)
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!longPressed.current) return
    event.preventDefault()
    event.stopPropagation()
    longPressed.current = false
  }

  return (
    <>
      <div
        className="relative mb-3.75 select-none touch-manipulation"
        onPointerDown={handlePointerDown}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        onPointerCancel={cancelPress}
        onContextMenu={(event) => event.preventDefault()}
        onClickCapture={handleClick}
      >
        {children}
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-400 flex animate-fade-in items-center justify-center bg-black/70"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-ticket-title"
            className="mx-5 w-full max-w-80 animate-pop-in rounded-2xl bg-surface-2 p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3.75 flex size-10 items-center justify-center rounded-full bg-red/15 text-red">
              <Trash2 size={20} aria-hidden="true" />
            </div>
            <h3 id="delete-ticket-title" className="text-lg font-bold">Delete this ticket?</h3>
            <p className="mt-1.5 text-sm leading-normal text-muted-2">
              This ticket will be removed from your events. This can't be undone.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg border-0 bg-surface-3 p-3.75 text-sm font-bold text-white"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg border-0 bg-red p-3.75 text-sm font-bold text-white"
                onClick={() => {
                  setConfirmOpen(false)
                  onDelete()
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

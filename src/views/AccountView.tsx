import {
  Bell,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Heart,
  Mail,
  MapPin,
  Send,
  ShieldHalf,
  Upload,
  User,
} from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import type { GeneratorDraft, LocationOption, ReceiptSettings, TicketVariant } from '../types'

interface AccountViewProps {
  location: LocationOption
  draft: GeneratorDraft
  receiptSettings: ReceiptSettings
  onChange: (field: keyof GeneratorDraft, value: string) => void
  onVariantChange: (index: number, field: keyof TicketVariant, value: string) => void
  onReceiptSettingChange: (field: keyof ReceiptSettings, value: string) => void
  onGenerate: () => void
}

const fields: Array<{
  key: Exclude<keyof GeneratorDraft, 'variants'>
  label: string
  placeholder: string
  type?: 'datetime-local' | 'time'
}> = [
  { key: 'event', label: 'Event name', placeholder: 'Event Name (e.g., OASIS)' },
  { key: 'loc', label: 'Location', placeholder: 'Location (e.g., Celtic Park)' },
  { key: 'date', label: 'Date and time', placeholder: 'Date & Time', type: 'datetime-local' },
  { key: 'doors', label: 'Doors open', placeholder: 'Doors Open (Time)', type: 'time' },
  { key: 'holder', label: 'Ticket holder', placeholder: 'Ticket Holder' },
]

const variantFields: Array<{
  key: keyof TicketVariant
  label: string
  placeholder: string
}> = [
  { key: 'section', label: 'Section', placeholder: 'Section' },
  { key: 'row', label: 'Row', placeholder: 'Row' },
  { key: 'seat', label: 'Seat', placeholder: 'Seat' },
  { key: 'entrance', label: 'Entrance or gate', placeholder: 'Entrance/Gate' },
]

const inputClass =
  'w-full rounded-lg border border-[#333333] bg-surface-2 p-3 text-base text-white outline-none placeholder:text-[#777777] focus:border-blue-action focus:outline-none'

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative h-6 w-10 shrink-0 cursor-pointer rounded-xl border-0 p-0 transition-colors duration-300 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:content-[''] after:transition-transform after:duration-300 ${checked ? 'bg-blue after:translate-x-4 after:bg-white' : 'bg-[#333333] after:bg-white'}`}
      onClick={() => onChange(!checked)}
    />
  )
}

export function AccountView({
  location,
  draft,
  receiptSettings,
  onChange,
  onVariantChange,
  onReceiptSettingChange,
  onGenerate,
}: AccountViewProps) {
  const [locationContent, setLocationContent] = useState(false)
  const [notifications, setNotifications] = useState(true)

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange('image', reader.result)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface">
      <main className="flex-1 overflow-y-auto overscroll-contain pb-[calc(var(--nav-height)+24px+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3.75 p-5">
          <div className="flex h-12.5 w-12.5 shrink-0 items-center justify-center rounded-full bg-blue text-xl font-bold">B</div>
          <div>
            <h2 className="text-lg font-bold">Blackknight</h2>
            <p className="text-xs text-muted">blackknight01020@gmail.com</p>
          </div>
        </div>

        <section className="mb-6.25">
          <h3 className="px-5 pb-2.5 text-sm font-semibold text-[#cccccc]">Ticket Generator</h3>
          <form
            className="flex flex-col gap-2.5 px-5 pb-5"
            onSubmit={(event) => {
              event.preventDefault()
              onGenerate()
            }}
          >
            {fields.map(({ key, label, placeholder, type }) => (
              <label className="block" key={key}>
                {type ? (
                  <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
                ) : (
                  <span className="sr-only">{label}</span>
                )}
                <input
                  type={type ?? 'text'}
                  placeholder={
                    type
                      ? undefined
                      : key === 'loc'
                        ? `Location (e.g., ${location.city})`
                        : placeholder
                  }
                  value={draft[key]}
                  onChange={(event) => onChange(key, event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  className={inputClass}
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted">Amount of tickets</span>
              <input
                type="number"
                min={1}
                max={50}
                value={draft.amount}
                onChange={(event) => onChange('amount', event.target.value)}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted">Price</span>
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={draft.price}
                onChange={(event) => onChange('price', event.target.value)}
                className={inputClass}
              />
            </label>

            {draft.variants.map((entry, index) => (
              <fieldset key={index} className="rounded-lg border border-[#333333] bg-surface-2/50 p-3">
                <legend className="px-1.5 text-xs font-semibold text-muted">Ticket {index + 1}</legend>
                <div className="grid grid-cols-2 gap-2.5">
                  {variantFields.map(({ key, label, placeholder }) => (
                    <label className="block" key={key}>
                      <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={entry[key]}
                        onChange={(event) => onVariantChange(index, key, event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        className={inputClass}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#444444] bg-surface-2 p-3 text-sm font-semibold text-[#cccccc]">
              <Upload size={16} aria-hidden="true" />
              Upload image from device
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageUpload}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted">Image URL (secondary)</span>
              <input
                type="url"
                inputMode="url"
                placeholder="Image URL (optional)"
                value={draft.image}
                onChange={(event) => onChange('image', event.target.value)}
                autoComplete="off"
                spellCheck={false}
                className={inputClass}
              />
            </label>

            <button type="submit" className="mt-0.5 w-full cursor-pointer rounded-lg border-0 bg-red p-3.5 text-sm font-bold text-white">
              Generate Ticket
            </button>
          </form>
        </section>

        <section className="mb-6.25">
          <h3 className="px-5 pb-2.5 text-sm font-semibold text-[#cccccc]">Receipt Settings</h3>
          <div className="flex flex-col gap-2.5 px-5">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted">Facility charge</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={receiptSettings.facilityCharge}
                onChange={(event) => onReceiptSettingChange('facilityCharge', event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted">Service fee</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={receiptSettings.serviceFee}
                onChange={(event) => onReceiptSettingChange('serviceFee', event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted">Delivery (blank = Free)</span>
              <input
                type="text"
                placeholder="Free"
                value={receiptSettings.delivery}
                onChange={(event) => onReceiptSettingChange('delivery', event.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="mb-6.25">
          <h3 className="px-5 pb-2.5 text-sm font-semibold text-[#cccccc]">Personalization</h3>
          <div className="mx-5 overflow-hidden rounded-card">
            <div className="flex items-center gap-3.75 border-b border-surface-3 bg-surface-2 px-5 py-3.75 text-sm last:border-b-0">
              <Mail size={18} className="shrink-0 text-[#cccccc]" aria-hidden="true" />
              <span className="flex-1">My Inbox</span>
              <ChevronRight size={16} className="text-[#555555]" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-3.75 border-b border-surface-3 bg-surface-2 px-5 py-3.75 text-sm last:border-b-0">
              <Heart size={18} className="shrink-0 text-[#cccccc]" aria-hidden="true" />
              <span className="flex-1">Favourites</span>
              <ChevronRight size={16} className="text-[#555555]" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-3.75 border-b border-surface-3 bg-surface-2 px-5 py-3.75 text-sm last:border-b-0">
              <MapPin size={18} className="shrink-0 text-[#cccccc]" aria-hidden="true" />
              <span className="flex-1">Location</span>
              <ChevronRight size={16} className="text-[#555555]" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="mb-6.25">
          <h3 className="px-5 pb-2.5 text-sm font-semibold text-[#cccccc]">Permissions</h3>
          <div className="mx-5 overflow-hidden rounded-card">
            <div className="flex items-center gap-3.75 border-b border-surface-3 bg-surface-2 px-5 py-3.75 text-sm last:border-b-0">
              <Send size={18} className="shrink-0 text-[#cccccc]" aria-hidden="true" />
              <span className="flex-1">Location Content</span>
              <Toggle
                checked={locationContent}
                onChange={setLocationContent}
                label="Location content"
              />
            </div>
            <div className="flex items-center gap-3.75 border-b border-surface-3 bg-surface-2 px-5 py-3.75 text-sm last:border-b-0">
              <Bell size={18} className="shrink-0 text-[#cccccc]" aria-hidden="true" />
              <span className="flex-1">Notifications</span>
              <Toggle checked={notifications} onChange={setNotifications} label="Notifications" />
            </div>
          </div>
        </section>

        <section className="mb-6.25">
          <h3 className="px-5 pb-2.5 text-sm font-semibold text-[#cccccc]">Account</h3>
          <div className="mx-5 overflow-hidden rounded-card">
            {[
              { icon: User, label: 'Edit Details' },
              { icon: ShieldHalf, label: 'Security' },
              { icon: CreditCard, label: 'Saved Payment Methods' },
              { icon: CircleDollarSign, label: 'Sell tickets' },
            ].map(({ icon: Icon, label }) => (
              <div className="flex items-center gap-3.75 border-b border-surface-3 bg-surface-2 px-5 py-3.75 text-sm last:border-b-0" key={label}>
                <Icon size={18} className="shrink-0 text-[#cccccc]" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                <ChevronRight size={16} className="text-[#555555]" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <p className="px-5 pb-6 text-center text-[11px] text-[#555555]">Tickets · v1.0</p>
      </main>
    </div>
  )
}

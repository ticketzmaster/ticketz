import { Bookmark, User } from "lucide-react";
import type { View } from "../types";

interface BottomNavProps {
  active: View;
  onChange: (view: View) => void;
}

function HomeMark({ active }: { active: boolean }) { 
  return (
    <span
      className={`flex size-6 items-center justify-center rounded-full transition-colors duration-200 ${active ? "bg-blue" : "bg-transparent"}`}
    >
      <img
        src="/homewhite-icon.png"
        alt=""
        aria-hidden="true"
        className="h-4 w-auto max-w-full object-contain"
      />
    </span>
  );
}



function TicketMark() {
  return (
    <span className="flex size-6 items-center justify-center">
      <img
        src="/blueticketAsset-1.png"
        alt=""
        aria-hidden="true"
        className="h-6 w-auto max-w-full object-contain"
      />
    </span>
  );
}



const items = [
  { view: "home" as const, label: "Home", icon: null },
  { view: "watchlist" as const, label: "Watchlist", icon: Bookmark },
  { view: "mytickets" as const, label: "My Tickets", icon: null },
  { view: "account" as const, label: "Account", icon: User },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-1000 flex h-(--nav-height) items-center justify-around border-t border-[#222222] bg-surface pb-[max(15px,env(safe-area-inset-bottom))]"
      aria-label="Main navigation"
    >
      {items.map(({ view, label, icon: Icon }) => (
        <button
          key={view}
          type="button"
          className={`flex w-15 cursor-pointer flex-col items-center gap-1.25 border-0 bg-transparent p-0 text-[10px] font-medium ${active === view ? "text-white" : "text-muted"}`}
          aria-current={active === view ? "page" : undefined}
          onClick={() => onChange(view)}
        >
          {view === "mytickets" ? (
            <TicketMark />
          ) : Icon ? (
            <Icon
              className="h-6 w-6 fill-none stroke-current transition-colors duration-200 [stroke-linecap:round] [stroke-linejoin:round]"
              size={24}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          ) : (
            <HomeMark active={active === "home"} />
          )}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

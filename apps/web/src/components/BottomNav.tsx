import type { NavSection } from "../app/store";

const navItems: { id: NavSection; label: string; icon: string }[] = [
  { id: "settings", label: "Settings", icon: "⚙️" },
  { id: "library", label: "Library", icon: "📚" },
  { id: "dictionary", label: "Dictionary", icon: "📖" },
  { id: "stats", label: "Stats", icon: "📊" },
  { id: "games", label: "Games", icon: "🎮" }
];

export const BottomNav = ({ nav, onNavigate }: { nav: NavSection; onNavigate: (nav: NavSection) => void }) => (
  <nav className="fixed bottom-6 left-1/2 z-40 w-[92%] max-w-xl -translate-x-1/2 rounded-full bg-ink/70 p-2 shadow-xl backdrop-blur">
    <div className="flex items-center justify-between">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`flex w-full flex-col items-center gap-1 rounded-full px-3 py-2 text-xs transition ${
            nav === item.id ? "bg-white/10 text-white" : "text-white/60"
          }`}
          onClick={() => onNavigate(item.id)}
          aria-label={item.label}
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  </nav>
);

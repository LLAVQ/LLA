import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

const navItems = [
  { label: "Settings", icon: "⚙️", to: "/settings" },
  { label: "Library", icon: "📚", to: "/" },
  { label: "Dictionary", icon: "📖", to: "/dictionary" },
  { label: "Stats", icon: "📊", to: "/stats" },
  { label: "Games", icon: "🎮", to: "/games" }
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-3xl -translate-x-1/2 rounded-full bg-ink-800/90 px-6 py-3 backdrop-blur-xl shadow-lg border border-white/10">
      <ul className="flex items-center justify-between text-xs font-semibold text-white/70">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center gap-1 transition",
                  isActive ? "text-white" : "hover:text-white"
                )
              }
              aria-label={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

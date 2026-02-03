interface TopBarProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function TopBar({ title, subtitle, actionLabel, onAction }: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">Lingua Library</p>
        <h1 className="text-3xl font-display font-semibold text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-white/60 max-w-2xl">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold shadow-glow transition hover:bg-accent-400"
        >
          {actionLabel}
        </button>
      )}
    </header>
  );
}

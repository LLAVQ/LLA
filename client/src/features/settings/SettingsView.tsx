export function SettingsView() {
  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Reading preferences</h3>
          <label className="grid gap-2 text-sm">
            Font selection
            <select className="rounded-xl bg-ink-800 px-4 py-2 text-white">
              <option>Inter (Default)</option>
              <option>Atkinson Hyperlegible</option>
              <option>Lexend</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Background theme
            <div className="flex gap-3">
              {['Light', 'Dark', 'Sepia'].map((theme) => (
                <button key={theme} className="rounded-full bg-white/10 px-4 py-2 text-xs">
                  {theme}
                </button>
              ))}
            </div>
          </label>
          <label className="grid gap-2 text-sm">
            Line spacing
            <input type="range" min="1" max="2" step="0.1" defaultValue="1.5" />
          </label>
        </div>
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Profile & Data</h3>
          <button className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold">
            Add / Remove languages
          </button>
          <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            Export dictionary & stats
          </button>
          <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            Import library data
          </button>
          <button className="rounded-full border border-red-400/60 px-4 py-2 text-sm font-semibold text-red-200">
            Reset learning profile
          </button>
        </div>
      </div>
    </section>
  );
}

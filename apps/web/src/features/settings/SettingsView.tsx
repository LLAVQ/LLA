import { motion } from "framer-motion";

export const SettingsView = () => (
  <div className="grid gap-6 lg:grid-cols-2">
    <div className="glass rounded-3xl p-6">
      <h2 className="text-xl font-semibold">Reader preferences</h2>
      <div className="mt-4 grid gap-4 text-sm text-white/70">
        <label className="grid gap-2">
          Font selection
          <select className="rounded-xl bg-white/10 px-3 py-2">
            <option>Inter</option>
            <option>Atkinson Hyperlegible</option>
            <option>Dyslexia-friendly</option>
          </select>
        </label>
        <label className="grid gap-2">
          Background theme
          <div className="flex gap-2">
            {"Light,Dark,Sepia".split(",").map((theme) => (
              <button key={theme} type="button" className="rounded-full bg-white/10 px-3 py-2 text-xs">
                {theme}
              </button>
            ))}
          </div>
        </label>
        <label className="grid gap-2">
          Line spacing
          <input type="range" min={1} max={2} step={0.1} className="w-full" />
        </label>
      </div>
    </div>
    <div className="glass rounded-3xl p-6">
      <h3 className="text-lg font-semibold">Profile & data</h3>
      <div className="mt-4 grid gap-3 text-sm text-white/70">
        <button type="button" className="rounded-2xl bg-white/10 px-4 py-3 text-left">
          Add or remove languages
        </button>
        <button type="button" className="rounded-2xl bg-white/10 px-4 py-3 text-left">
          Export dictionary & stats
        </button>
        <button type="button" className="rounded-2xl bg-white/10 px-4 py-3 text-left">
          Import learning profile
        </button>
        <motion.button
          type="button"
          className="rounded-2xl bg-red-500/20 px-4 py-3 text-left text-red-200"
          whileHover={{ scale: 1.01 }}
        >
          Reset learning profile
        </motion.button>
      </div>
    </div>
  </div>
);

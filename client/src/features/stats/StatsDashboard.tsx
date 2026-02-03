import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export function StatsDashboard() {
  const stats = useAppStore((state) => state.stats);

  const cards = [
    { label: "Reading streak", value: `${stats.streakDays} days` },
    { label: "Pages today", value: stats.pagesReadToday },
    { label: "Words learned", value: stats.wordsLearned },
    { label: "Time reading", value: `${stats.timeSpentMinutes} min` }
  ];

  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Stats & Momentum</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -4 }}
            className="glass-panel rounded-2xl p-5"
          >
            <p className="text-xs uppercase tracking-widest text-white/40">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold">{card.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="glass-panel rounded-3xl p-6">
        <h3 className="text-lg font-semibold">Weekly performance</h3>
        <div className="mt-4 flex h-40 items-end gap-3">
          {[32, 54, 76, 48, 92, 68, 88].map((value, index) => (
            <motion.div
              key={`bar-${index}`}
              className="w-full rounded-t-xl bg-accent-400/70"
              initial={{ height: 0 }}
              animate={{ height: `${value}%` }}
              transition={{ duration: 0.9, delay: index * 0.05 }}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-lg font-semibold">Words mastery</h3>
          <div className="mt-4 space-y-3 text-sm text-white/60">
            <div className="flex items-center justify-between">
              <span>Mastered</span>
              <span>{stats.wordsMastered}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reviewing</span>
              <span>{stats.wordsReviewing}</span>
            </div>
          </div>
          <div className="mt-4 h-3 w-full rounded-full bg-white/10">
            <div className="h-3 w-[58%] rounded-full bg-mint-400" />
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-lg font-semibold">Focus timeline</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {["Deep reading", "Vocabulary review", "Pronunciation drills", "Nighttime recap"].map(
              (item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-accent-400" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { useAppStore } from "../../app/store";

export const DictionaryView = () => {
  const { dictionary } = useAppStore();
  const entries = dictionary.length
    ? dictionary
    : [
        {
          id: "1",
          word: "lluvia",
          meaning: "rain",
          pronunciation: "/ˈʝuβja/",
          etymology: "Latin pluvia",
          usage: "Used in poetic descriptions",
          difficulty: "A2",
          addedAt: new Date().toISOString()
        }
      ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Dictionary</h2>
        <div className="mt-4 flex gap-2 text-xs text-white/60">
          <span className="rounded-full bg-white/10 px-3 py-1">Alphabetical</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Last added</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Frequency</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Difficulty</span>
        </div>
        <div className="mt-6 space-y-4">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              className="rounded-2xl bg-white/5 p-4"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{entry.word}</h3>
                  <p className="text-sm text-white/60">{entry.meaning}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{entry.difficulty}</span>
              </div>
              <div className="mt-3 text-xs text-white/60">
                <p>Pronunciation: {entry.pronunciation}</p>
                <p>Etymology: {entry.etymology}</p>
                <p>Usage: {entry.usage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold">Repeat in context</h3>
        <p className="mt-2 text-sm text-white/70">
          Generate adaptive sentences from your books and interests.
        </p>
        <motion.button
          type="button"
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-aurora to-indigo-500 px-4 py-3 text-sm font-semibold"
          whileHover={{ scale: 1.01 }}
        >
          Repeat in context
        </motion.button>
      </div>
    </div>
  );
};

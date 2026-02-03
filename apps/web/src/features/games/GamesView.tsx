import { motion } from "framer-motion";

const games = [
  "Flashcards",
  "Sentence building",
  "Drag-and-drop grammar",
  "Fill-the-gap",
  "Listening recognition",
  "Word decomposition"
];

export const GamesView = () => (
  <div className="glass rounded-3xl p-6">
    <h2 className="text-xl font-semibold">Learning games</h2>
    <p className="mt-2 text-sm text-white/70">Adaptive games powered by your reading stats.</p>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {games.map((game) => (
        <motion.div
          key={game}
          className="rounded-2xl bg-white/5 p-4"
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-semibold text-white">{game}</h3>
          <p className="mt-2 text-xs text-white/60">Difficulty adapts based on mastery trends.</p>
        </motion.div>
      ))}
    </div>
  </div>
);

import { motion } from "framer-motion";

const games = [
  { title: "Flashcards", description: "Spaced repetition tuned to your mastery score." },
  { title: "Sentence Building", description: "Drag tokens to build grammatically correct lines." },
  { title: "Grammar Blocks", description: "Snap prefixes, roots, and suffixes together." },
  { title: "Fill the Gap", description: "Complete passages from your current book." },
  { title: "Listening Recognition", description: "Identify spoken words in realistic accents." }
];

export function GamesView() {
  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Learning Games</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <motion.article
            key={game.title}
            whileHover={{ y: -4 }}
            className="glass-panel rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold">{game.title}</h3>
            <p className="mt-2 text-sm text-white/60">{game.description}</p>
            <button className="mt-4 rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold">
              Play now
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

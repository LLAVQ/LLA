import { motion } from "framer-motion";

const words = [
  {
    term: "serendipity",
    meaning: "The occurrence of events by chance in a happy way.",
    pronunciation: "/ˌsɛrənˈdɪpɪti/",
    difficulty: "B2"
  },
  {
    term: "ephemeral",
    meaning: "Lasting for a very short time.",
    pronunciation: "/ɪˈfɛmərəl/",
    difficulty: "C1"
  },
  {
    term: "luminescent",
    meaning: "Emitting light not caused by heat.",
    pronunciation: "/ˌluːmɪˈnɛs(ə)nt/",
    difficulty: "B1"
  }
];

export function DictionaryView() {
  return (
    <section className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dictionary</h2>
        <button className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold">
          Repeat in context
        </button>
      </div>
      <div className="grid gap-4">
        {words.map((word) => (
          <motion.article
            key={word.term}
            whileHover={{ y: -4 }}
            className="glass-panel rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{word.term}</h3>
                <p className="text-sm text-white/60">{word.pronunciation}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                {word.difficulty}
              </span>
            </div>
            <p className="mt-3 text-sm text-white/70">{word.meaning}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
              <span className="rounded-full bg-white/10 px-3 py-1">Synonyms: chance, fate</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Etymology: Persian roots</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Grammar: noun</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

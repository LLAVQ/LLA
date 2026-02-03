import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

export function LibraryView() {
  const recommendations = useAppStore((state) => state.recommendations);
  const library = useAppStore((state) => state.library);
  const books = library.length ? library : recommendations;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Your Library</h2>
      <p className="text-sm text-white/60">
        Curated from real books. Tap a cover to open the reader and dive into linguistic insights.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <motion.article
            key={book.id}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-3xl p-5 space-y-4"
          >
            <div className="aspect-[3/4] w-full rounded-2xl bg-gradient-to-br from-accent-500/40 to-mint-400/30" />
            <div>
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-white/60">{book.author}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/60">
              <span className="rounded-full bg-white/10 px-3 py-1">Difficulty: {book.difficulty}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Match {book.genreMatchScore}%</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Pages {book.pages ?? 320}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>Progress</span>
                <span>36%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[36%] rounded-full bg-mint-400" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

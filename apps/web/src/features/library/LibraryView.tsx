import { motion } from "framer-motion";
import { ProgressBar } from "../../components/ProgressBar";
import { useAppStore } from "../../app/store";

export const LibraryView = () => {
  const { library, setSelectedBook } = useAppStore();

  if (library.length === 0) {
    return (
      <div className="glass rounded-3xl p-10 text-center text-white/70">
        <p className="text-lg">Your library is ready for discovery.</p>
        <p className="mt-2 text-sm">Run onboarding to generate 20 curated recommendations.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {library.map((book) => (
        <motion.button
          key={book.id}
          type="button"
          className="glass flex flex-col overflow-hidden rounded-3xl text-left"
          onClick={() => setSelectedBook(book)}
          whileHover={{ y: -4 }}
        >
          <div className="relative h-56 w-full">
            <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent" />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div>
              <h3 className="text-lg font-semibold text-white">{book.title}</h3>
              <p className="text-sm text-white/60">{book.author}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/60">
              <span className="rounded-full bg-white/10 px-3 py-1">{book.difficulty}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{book.pages} pages</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{book.rating?.toFixed(1)} ★</span>
            </div>
            <div className="mt-auto">
              <ProgressBar value={book.progress} />
              <p className="mt-2 text-xs text-white/50">Read progress {book.progress}%</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

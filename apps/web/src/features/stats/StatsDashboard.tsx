import { motion } from "framer-motion";
import { useAppStore } from "../../app/store";

export const StatsDashboard = () => {
  const { stats } = useAppStore();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Reading streak</h2>
        <p className="mt-2 text-sm text-white/70">{stats.streakDays} days of consistent reading.</p>
        <div className="mt-6 flex gap-3">
          {stats.pagesPerDay.map((pages, index) => (
            <motion.div
              key={`${pages}-${index}`}
              className="flex h-32 w-10 items-end rounded-full bg-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="w-full rounded-full bg-gradient-to-t from-aurora to-indigo-500"
                style={{ height: `${pages * 2}%` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold">Mastery overview</h3>
        <div className="mt-6 grid gap-4 text-sm text-white/70">
          <div className="flex items-center justify-between">
            <span>Words learned</span>
            <span className="text-white">{stats.wordsLearned}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Words mastered</span>
            <span className="text-white">{stats.wordsMastered}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Review queue</span>
            <span className="text-white">{stats.wordsReviewing}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Minutes reading</span>
            <span className="text-white">{stats.minutesRead}</span>
          </div>
          <motion.button
            type="button"
            className="mt-2 rounded-2xl bg-white/10 px-4 py-3 text-xs"
            whileHover={{ scale: 1.01 }}
          >
            View detailed analytics
          </motion.button>
        </div>
      </div>
    </div>
  );
};

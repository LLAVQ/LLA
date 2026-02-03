import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "./components/BottomNav";
import { FloatingAction } from "./components/FloatingAction";
import { OnboardingFlow } from "./features/onboarding/OnboardingFlow";
import { LibraryView } from "./features/library/LibraryView";
import { ReaderView } from "./features/reader/ReaderView";
import { StatsDashboard } from "./features/stats/StatsDashboard";
import { DictionaryView } from "./features/dictionary/DictionaryView";
import { GamesView } from "./features/games/GamesView";
import { SettingsView } from "./features/settings/SettingsView";
import { useAppStore } from "./app/store";

const SectionView = () => {
  const { nav } = useAppStore();

  if (nav === "reader") {
    return <ReaderView />;
  }

  if (nav === "library") {
    return <LibraryView />;
  }

  if (nav === "dictionary") {
    return <DictionaryView />;
  }

  if (nav === "stats") {
    return <StatsDashboard />;
  }

  if (nav === "games") {
    return <GamesView />;
  }

  return <SettingsView />;
};

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { nav, setNav } = useAppStore();

  return (
    <div className="min-h-screen bg-midnight pb-32">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-24">
        <motion.div
          className="mb-10 flex flex-col gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-semibold">Lingua Library Atlas</h1>
          <p className="text-white/60">
            Learn languages through real books with deep linguistic analysis, interactive reading, and adaptive
            games.
          </p>
        </motion.div>
        {showOnboarding ? <OnboardingFlow onClose={() => setShowOnboarding(false)} /> : <SectionView />}
      </div>
      <FloatingAction onClick={() => setShowOnboarding(true)} />
      <BottomNav nav={nav} onNavigate={setNav} />
    </div>
  );
};

export default App;

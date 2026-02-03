import { Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { HomeView } from "@/features/library/HomeView";
import { ReaderView } from "@/features/reader/ReaderView";
import { StatsDashboard } from "@/features/stats/StatsDashboard";
import { DictionaryView } from "@/features/dictionary/DictionaryView";
import { GamesView } from "@/features/games/GamesView";
import { SettingsView } from "@/features/settings/SettingsView";

export default function App() {
  return (
    <div className="min-h-screen bg-ink-900 pb-24">
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <TopBar
          title="Learn through real books"
          subtitle="A language learning experience grounded in real literature, dynamic AI guidance, and powerful linguistic analysis."
          actionLabel="➕ Languages & Interests"
        />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/reader" element={<ReaderView />} />
          <Route path="/stats" element={<StatsDashboard />} />
          <Route path="/dictionary" element={<DictionaryView />} />
          <Route path="/games" element={<GamesView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

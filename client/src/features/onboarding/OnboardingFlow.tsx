import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedTimeline } from "@/components/AnimatedTimeline";
import { useAppStore } from "@/store/useAppStore";
import { BookRecommendation, LanguageProfile } from "@/types";

const steps = [
  "Thinking…",
  "Analyzing your preferences…",
  "AI at work…",
  "Searching books…",
  "Finding previews…"
];

const mockBooks: BookRecommendation[] = Array.from({ length: 6 }).map((_, index) => ({
  id: `rec-${index}`,
  title: [
    "The Night Train to Kyoto",
    "Cloud Atlas of Madrid",
    "Echoes of the Han",
    "Lisbon in Rain",
    "The Scholar's Orchard",
    "Midnight in Marseille"
  ][index],
  author: [
    "Hana Mori",
    "Luis Calderón",
    "Wei Zhang",
    "Inês Rocha",
    "Amir Haddad",
    "Camille Dubois"
  ][index],
  difficulty: ["A2", "B1", "B2", "B1", "C1", "A2"][index],
  genreMatchScore: 82 + index * 3,
  reason: "Matched to your love of immersive literary fiction and gentle cultural notes."
}));

export function OnboardingFlow() {
  const [nativeLanguage, setNativeLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Japanese");
  const [level, setLevel] = useState("B1");
  const [interests, setInterests] = useState("Literary fiction, history, travel");
  const [difficultyTolerance, setDifficultyTolerance] = useState("balanced");
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const setLanguages = useAppStore((state) => state.setLanguages);
  const setRecommendations = useAppStore((state) => state.setRecommendations);

  const languageProfile: LanguageProfile = useMemo(
    () => ({
      id: "lang-1",
      language: targetLanguage,
      level: level as LanguageProfile["level"],
      interests: interests.split(",").map((item) => item.trim()),
      difficultyTolerance: difficultyTolerance as LanguageProfile["difficultyTolerance"]
    }),
    [targetLanguage, level, interests, difficultyTolerance]
  );

  const startOnboarding = async () => {
    setLoading(true);
    for (let index = 0; index < steps.length; index += 1) {
      setActiveStep(index);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    setLanguages([languageProfile]);
    setRecommendations(mockBooks);
    setLoading(false);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-panel rounded-3xl p-8">
        <h2 className="text-2xl font-display font-semibold">Personalize your library</h2>
        <p className="mt-2 text-white/60">
          We craft your first 20 book recommendations with deep linguistic analysis and genre alignment.
        </p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            Native language
            <input
              value={nativeLanguage}
              onChange={(event) => setNativeLanguage(event.target.value)}
              className="rounded-xl bg-ink-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-accent-400"
            />
          </label>
          <label className="grid gap-2 text-sm">
            Target language
            <input
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
              className="rounded-xl bg-ink-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-accent-400"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Proficiency level
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="rounded-xl bg-ink-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-accent-400"
              >
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Difficulty tolerance
              <select
                value={difficultyTolerance}
                onChange={(event) => setDifficultyTolerance(event.target.value)}
                className="rounded-xl bg-ink-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-accent-400"
              >
                <option value="gentle">Gentle</option>
                <option value="balanced">Balanced</option>
                <option value="bold">Bold</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            Interests (genres, themes)
            <textarea
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              rows={3}
              className="rounded-xl bg-ink-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-accent-400"
            />
          </label>
          <button
            onClick={startOnboarding}
            className="mt-2 rounded-full bg-accent-500 px-6 py-3 font-semibold shadow-glow transition hover:bg-accent-400"
          >
            {loading ? "Generating library…" : "Generate recommendations"}
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <AnimatedTimeline steps={steps} activeStep={activeStep} />
        <motion.div
          className="glass-panel rounded-3xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold">AI Reasoning Preview</h3>
          <p className="mt-2 text-sm text-white/60">
            We analyze intent, proficiency, and thematic preferences to score every candidate book.
          </p>
          <div className="mt-4 grid gap-3">
            {mockBooks.slice(0, 3).map((book) => (
              <div key={book.id} className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm font-semibold">{book.title}</p>
                <p className="text-xs text-white/50">{book.reason}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

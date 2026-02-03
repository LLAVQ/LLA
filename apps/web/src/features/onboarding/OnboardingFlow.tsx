import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedTimeline } from "../../components/AnimatedTimeline";
import { buildOnboardingPipeline, runRecommendationPipeline } from "../../app/orchestration/pipeline";
import { useAppStore } from "../../app/store";
import type { LanguageProfile } from "../../app/types";

const defaultInterests = ["Fantasy", "Sci-fi", "History", "Romance", "Mystery", "Poetry"];

export const OnboardingFlow = ({ onClose }: { onClose?: () => void }) => {
  const [nativeLanguage, setNativeLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [level, setLevel] = useState("B1");
  const [tolerance, setTolerance] = useState<LanguageProfile["difficultyTolerance"]>("medium");
  const [interests, setInterests] = useState<string[]>(["Fantasy", "History"]);
  const [steps, setSteps] = useState(buildOnboardingPipeline());
  const [isRunning, setIsRunning] = useState(false);
  const { setProfile, setRecommendations, setLibrary } = useAppStore();

  const canSubmit = useMemo(() => !isRunning, [isRunning]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    const profile: LanguageProfile = {
      id: crypto.randomUUID(),
      native: nativeLanguage,
      target: targetLanguage,
      cefrLevel: level,
      interests,
      difficultyTolerance: tolerance
    };
    setProfile(profile);
    setIsRunning(true);
    try {
      const { recommendations } = await runRecommendationPipeline(profile, setSteps);
      setRecommendations(recommendations);
      setLibrary(
        recommendations.map((rec, index) => ({
          id: rec.id,
          title: rec.title,
          author: rec.author,
          coverUrl: `https://picsum.photos/seed/book-${index}/240/320`,
          format: ["PDF", "EPUB"],
          pages: 180 + index * 12,
          language: targetLanguage,
          rating: 4.2 + (index % 4) * 0.1,
          difficulty: rec.difficulty,
          progress: Math.min(80, index * 6)
        }))
      );
      onClose?.();
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Personalize your library</h2>
        <p className="mt-2 text-sm text-white/70">
          Tell us your native language, your target language, and what kinds of stories light you up.
        </p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            Native language
            <input
              className="rounded-xl bg-white/10 px-4 py-2"
              value={nativeLanguage}
              onChange={(event) => setNativeLanguage(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Target language
            <input
              className="rounded-xl bg-white/10 px-4 py-2"
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Proficiency level
            <div className="flex flex-wrap gap-2">
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`rounded-full px-4 py-2 text-xs ${
                    level === option ? "bg-aurora text-white" : "bg-white/10 text-white/70"
                  }`}
                  onClick={() => setLevel(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>
          <label className="grid gap-2 text-sm">
            Difficulty tolerance
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`rounded-full px-4 py-2 text-xs capitalize ${
                    tolerance === option ? "bg-aurora text-white" : "bg-white/10 text-white/70"
                  }`}
                  onClick={() => setTolerance(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>
          <div className="grid gap-2 text-sm">
            <span>Interests</span>
            <div className="flex flex-wrap gap-2">
              {defaultInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`rounded-full px-4 py-2 text-xs ${
                    interests.includes(interest) ? "bg-aurora text-white" : "bg-white/10 text-white/70"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
        <motion.button
          type="button"
          disabled={!canSubmit}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-aurora to-indigo-500 px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
        >
          Generate personalized library
        </motion.button>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold">AI orchestration status</h3>
        <p className="mt-2 text-sm text-white/70">
          Real-time MCP-style pipeline that turns your answers into structured book recs.
        </p>
        <div className="mt-6">
          <AnimatedTimeline steps={steps} />
        </div>
        <div className="mt-6 rounded-2xl bg-white/5 p-4 text-xs text-white/70">
          <p className="font-semibold text-white">Pipeline inputs</p>
          <p className="mt-2">Input → AI reasoning → structured JSON output</p>
          <p className="mt-2">OpenAI-compatible endpoint, swappable provider.</p>
        </div>
      </div>
    </div>
  );
};

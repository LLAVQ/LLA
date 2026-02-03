import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

const sampleParagraph =
  "The ancient library whispered in the rain, each page a bridge between cultures and centuries.";

const sampleCharacters = ["古", "書", "館", "は", "雨", "の", "中", "で", "囁", "い", "た"];

export function ReaderView() {
  const [segmentation, setSegmentation] = useState(true);
  const activeInsight = useAppStore((state) => state.activeInsight);
  const setActiveInsight = useAppStore((state) => state.setActiveInsight);

  const handleTap = (term: string) => {
    setActiveInsight({
      term,
      meaning: "Ancient library",
      components: ["ancient", "library"],
      grammarRole: "Noun phrase",
      pronunciation: "lay-brer-ee",
      ipa: "/ˈlaɪˌbrɛri/",
      examples: [
        "The library stands by the sea.",
        "Libraries preserve collective memory."
      ]
    });
  };

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="glass-panel rounded-3xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Reader Mode</h2>
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input
              type="checkbox"
              checked={segmentation}
              onChange={() => setSegmentation((value) => !value)}
              className="h-4 w-4 rounded border-white/20"
            />
            Word segmentation
          </label>
        </div>
        <div className="space-y-6 text-lg leading-relaxed">
          <div className="space-x-1">
            {sampleParagraph.split(" ").map((word) => (
              <button
                key={word}
                onClick={() => handleTap(word)}
                className="rounded-md px-1 transition hover:bg-white/10"
              >
                {word}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleCharacters.map((character) => (
              <button
                key={character}
                onClick={() => handleTap(character)}
                className={`rounded-md px-2 py-1 text-xl transition ${
                  segmentation ? "bg-white/10" : "bg-transparent"
                } hover:bg-white/20`}
              >
                {character}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/60">
          PDF parsing powered by pdf.js — pages are rendered into a paginated, offline-first cache.
        </div>
      </div>
      <motion.aside
        className="glass-panel rounded-3xl p-6 space-y-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Word breakdown</h3>
          <button
            onClick={() => setActiveInsight(undefined)}
            className="text-xs text-white/50 hover:text-white"
          >
            Clear
          </button>
        </div>
        {activeInsight ? (
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-white/50">Term</p>
              <p className="text-lg font-semibold">{activeInsight.term}</p>
            </div>
            <div>
              <p className="text-white/50">Meaning</p>
              <p>{activeInsight.meaning}</p>
            </div>
            <div>
              <p className="text-white/50">Components</p>
              <div className="flex flex-wrap gap-2">
                {activeInsight.components.map((component) => (
                  <span key={component} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                    {component}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/50">Grammar role</p>
              <p>{activeInsight.grammarRole}</p>
            </div>
            <div>
              <p className="text-white/50">Pronunciation</p>
              <p>
                {activeInsight.pronunciation} <span className="text-white/40">{activeInsight.ipa}</span>
              </p>
            </div>
            <div>
              <p className="text-white/50">Examples</p>
              <ul className="list-disc pl-5 text-white/70">
                {activeInsight.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
            <button className="w-full rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold">
              ➕ Add to Dictionary
            </button>
          </div>
        ) : (
          <p className="text-sm text-white/50">
            Tap any word or character to see morphology, pronunciation, and grammar insights.
          </p>
        )}
      </motion.aside>
    </section>
  );
}

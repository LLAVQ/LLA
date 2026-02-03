import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../../app/store";
import { featureFlags } from "../../app/featureFlags";
import { ProgressBar } from "../../components/ProgressBar";

const sampleParagraph =
  "La lluvia cae suavemente sobre los tejados antiguos mientras los lectores descubren palabras nuevas.";

export const ReaderView = () => {
  const { selectedBook, setSelectedBook } = useAppStore();
  const [segmentationEnabled, setSegmentationEnabled] = useState(true);
  const [selectedToken, setSelectedToken] = useState("lluvia");

  if (!selectedBook) {
    return null;
  }

  const tokens = sampleParagraph.split(" ");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{selectedBook.title}</h2>
            <p className="text-sm text-white/60">{selectedBook.author}</p>
          </div>
          <button
            type="button"
            className="rounded-full bg-white/10 px-4 py-2 text-xs"
            onClick={() => setSelectedBook(undefined)}
          >
            Exit reader
          </button>
        </div>
        <div className="mt-6">
          <ProgressBar value={selectedBook.progress} />
        </div>
        <div className="mt-6 rounded-2xl bg-white/5 p-5 text-sm leading-8">
          {tokens.map((token, index) => (
            <button
              key={`${token}-${index}`}
              type="button"
              className={`mr-2 rounded-md px-1 py-0.5 transition ${
                selectedToken === token ? "bg-aurora/30 text-white" : "text-white/80"
              }`}
              onClick={() => setSelectedToken(token)}
            >
              {token}
            </button>
          ))}
        </div>
        {featureFlags.enableSegmentation && (
          <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
            <span>Segmentation</span>
            <button
              type="button"
              className={`rounded-full px-3 py-1 ${
                segmentationEnabled ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10"
              }`}
              onClick={() => setSegmentationEnabled((prev) => !prev)}
            >
              {segmentationEnabled ? "ON" : "OFF"}
            </button>
          </div>
        )}
        <div className="mt-6 text-xs text-white/50">
          <p>PDF parsing powered by pdf.js with offline-ready caching.</p>
        </div>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold">Word breakdown</h3>
        <div className="mt-4 space-y-3 text-sm text-white/70">
          <div>
            <p className="text-xs uppercase text-white/40">Selected</p>
            <p className="text-lg font-semibold text-white">{selectedToken}</p>
          </div>
          <div className="grid gap-2">
            <p>Meaning: gentle rain</p>
            <p>Components: lluvia (root)</p>
            <p>Grammar role: noun</p>
            <p>Pronunciation: /ˈʝuβja/</p>
            <p>Example: "La lluvia es tranquila hoy."</p>
          </div>
          <motion.button
            type="button"
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-aurora to-indigo-500 px-4 py-3 text-sm font-semibold"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            ➕ Add to Dictionary
          </motion.button>
        </div>
      </div>
    </div>
  );
};

import express from "express";
import fetch from "node-fetch";
import { createOpenAICompatibleClient } from "./ai/provider";
import { runRecommendationPipeline } from "./orchestration/recommendationPipeline";
import { zlibScraper } from "./scrapers/zlibScraper";
import { saveRecommendations } from "./storage/database";

const fetcher = fetch as unknown as typeof globalThis.fetch;
globalThis.fetch = fetcher;

const app = express();
app.use(express.json({ limit: "2mb" }));

const aiClient = createOpenAICompatibleClient({
  apiKey: process.env.OPENAI_API_KEY ?? "",
  baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com",
  model: process.env.OPENAI_MODEL ?? "gpt-4o-mini"
});

app.post("/api/ai/recommendations", async (req, res) => {
  try {
    const payload = req.body as {
      native: string;
      target: string;
      cefrLevel: string;
      interests: string[];
      difficultyTolerance: string;
    };

    const result = await runRecommendationPipeline(aiClient, payload);
    saveRecommendations(result.recommendations);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

app.post("/api/scrape/zlib", async (req, res) => {
  const { searchName, html } = req.body as { searchName?: string; html?: string };

  if (!searchName && !html) {
    res.status(400).json({ error: "Provide searchName or html" });
    return;
  }

  try {
    const pageHtml =
      html ??
      (await fetch(`https://z-lib.sk/s/${encodeURIComponent(searchName ?? "")}`)).text();

    const results = zlibScraper.parseSearchResults(pageHtml);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape metadata" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`LLA server running on ${port}`);
});

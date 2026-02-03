import { Router } from "express";
import { z } from "zod";
import { requestAI, getAIConfig } from "../services/aiClient.js";
import { runPipeline } from "../services/orchestration.js";
import { saveRecommendation } from "../db/index.js";
import { OnboardingResponse } from "../types.js";

const router = Router();

const onboardingSchema = z.object({
  nativeLanguage: z.string(),
  targetLanguages: z.array(
    z.object({
      language: z.string(),
      level: z.string()
    })
  ),
  interests: z.array(z.string()),
  difficultyTolerance: z.string()
});

router.post("/onboarding", async (req, res) => {
  const payload = onboardingSchema.parse(req.body);

  try {
    const { result, trace } = await runPipeline(payload, [
      {
        name: "Input validation",
        run: async (input) => input
      },
      {
        name: "AI reasoning",
        run: async (input) => {
          const schemaHint =
            "Return JSON with recommendations: [{id,title,author,difficulty,genreMatchScore,reason}].";
          const data = await requestAI<typeof payload, { recommendations: OnboardingResponse["recommendations"] }>(
            getAIConfig(),
            input,
            schemaHint
          );
          return data;
        }
      },
      {
        name: "Persistence",
        run: async (input) => {
          saveRecommendation(`rec-${Date.now()}`, JSON.stringify(input));
          return input;
        }
      }
    ]);

    res.json({
      recommendations: result.recommendations ?? [],
      trace
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;

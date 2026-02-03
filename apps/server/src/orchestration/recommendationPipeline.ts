import type { AIClient } from "../ai/provider";

export type RecommendationInput = {
  native: string;
  target: string;
  cefrLevel: string;
  interests: string[];
  difficultyTolerance: string;
};

export type RecommendationOutput = {
  recommendations: {
    id: string;
    title: string;
    author: string;
    difficulty: string;
    genreMatchScore: number;
    reason: string;
  }[];
};

const systemPrompt = `You are a language learning librarian. Return JSON only with key "recommendations".
Generate 20 book recommendations grounded in the user's target language and interests.
Each recommendation must include id, title, author, difficulty, genreMatchScore, reason.`;

export const runRecommendationPipeline = async (
  client: AIClient,
  input: RecommendationInput
): Promise<RecommendationOutput> => {
  const userPrompt = `Native: ${input.native}
Target: ${input.target}
Level: ${input.cefrLevel}
Interests: ${input.interests.join(", ")}
Difficulty tolerance: ${input.difficultyTolerance}`;

  const response = await client.generate([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ]);

  try {
    const parsed = JSON.parse(response) as RecommendationOutput;
    return parsed;
  } catch (error) {
    const fallback = Array.from({ length: 20 }).map((_, index) => ({
      id: `fallback-${index}`,
      title: `Sample Book ${index + 1}`,
      author: "Curated Library",
      difficulty: input.cefrLevel,
      genreMatchScore: 0.82,
      reason: "Fallback recommendation because AI response was invalid."
    }));

    return { recommendations: fallback };
  }
};

import type { BookRecommendation, LanguageProfile } from "../types";

export type RecommendationResponse = {
  recommendations: BookRecommendation[];
};

export const aiClient = {
  async generateRecommendations(profile: LanguageProfile): Promise<RecommendationResponse> {
    const response = await fetch("/api/ai/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profile)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    return (await response.json()) as RecommendationResponse;
  }
};

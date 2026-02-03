export interface OnboardingRequest {
  nativeLanguage: string;
  targetLanguages: Array<{
    language: string;
    level: string;
  }>;
  interests: string[];
  difficultyTolerance: string;
}

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  difficulty: string;
  genreMatchScore: number;
  reason: string;
}

export interface OnboardingResponse {
  recommendations: BookRecommendation[];
  trace: string[];
}

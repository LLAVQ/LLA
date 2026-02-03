export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface LanguageProfile {
  id: string;
  language: string;
  level: CEFRLevel;
  interests: string[];
  difficultyTolerance: "gentle" | "balanced" | "bold";
}

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  difficulty: string;
  genreMatchScore: number;
  reason: string;
  cover?: string;
  formats?: string[];
  pages?: number;
  language?: string;
  rating?: number;
}

export interface ReaderWordInsight {
  term: string;
  meaning: string;
  components: string[];
  grammarRole: string;
  pronunciation: string;
  ipa: string;
  examples: string[];
}

export interface ReadingStats {
  streakDays: number;
  pagesReadToday: number;
  pagesReadThisWeek: number;
  wordsLearned: number;
  wordsMastered: number;
  wordsReviewing: number;
  timeSpentMinutes: number;
}

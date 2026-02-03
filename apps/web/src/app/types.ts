export type LanguageProfile = {
  id: string;
  native: string;
  target: string;
  cefrLevel: string;
  interests: string[];
  difficultyTolerance: "low" | "medium" | "high";
};

export type BookRecommendation = {
  id: string;
  title: string;
  author: string;
  difficulty: string;
  genreMatchScore: number;
  reason: string;
};

export type BookMetadata = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  format: string[];
  pages: number;
  language: string;
  rating?: number;
  difficulty: string;
  progress: number;
};

export type DictionaryEntry = {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  etymology: string;
  usage: string;
  difficulty: string;
  addedAt: string;
};

export type ReadingStats = {
  streakDays: number;
  pagesPerDay: number[];
  wordsLearned: number;
  wordsMastered: number;
  wordsReviewing: number;
  minutesRead: number;
};

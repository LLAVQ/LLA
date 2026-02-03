import { create } from "zustand";
import { BookRecommendation, LanguageProfile, ReadingStats, ReaderWordInsight } from "@/types";

interface AppState {
  nativeLanguage: string;
  languages: LanguageProfile[];
  recommendations: BookRecommendation[];
  library: BookRecommendation[];
  stats: ReadingStats;
  activeInsight?: ReaderWordInsight;
  setNativeLanguage: (value: string) => void;
  setLanguages: (value: LanguageProfile[]) => void;
  setRecommendations: (value: BookRecommendation[]) => void;
  addToLibrary: (book: BookRecommendation) => void;
  setStats: (value: ReadingStats) => void;
  setActiveInsight: (value?: ReaderWordInsight) => void;
}

const initialStats: ReadingStats = {
  streakDays: 12,
  pagesReadToday: 18,
  pagesReadThisWeek: 124,
  wordsLearned: 230,
  wordsMastered: 120,
  wordsReviewing: 90,
  timeSpentMinutes: 96
};

export const useAppStore = create<AppState>((set) => ({
  nativeLanguage: "English",
  languages: [],
  recommendations: [],
  library: [],
  stats: initialStats,
  activeInsight: undefined,
  setNativeLanguage: (value) => set({ nativeLanguage: value }),
  setLanguages: (value) => set({ languages: value }),
  setRecommendations: (value) => set({ recommendations: value }),
  addToLibrary: (book) =>
    set((state) => ({ library: [...state.library.filter((item) => item.id !== book.id), book] })),
  setStats: (value) => set({ stats: value }),
  setActiveInsight: (value) => set({ activeInsight: value })
}));

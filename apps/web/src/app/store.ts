import { create } from "zustand";
import type { BookMetadata, BookRecommendation, DictionaryEntry, LanguageProfile, ReadingStats } from "./types";

export type NavSection = "library" | "dictionary" | "stats" | "games" | "settings" | "reader";

type AppState = {
  nav: NavSection;
  profile?: LanguageProfile;
  recommendations: BookRecommendation[];
  library: BookMetadata[];
  dictionary: DictionaryEntry[];
  stats: ReadingStats;
  selectedBook?: BookMetadata;
  setNav: (nav: NavSection) => void;
  setProfile: (profile: LanguageProfile) => void;
  setRecommendations: (recommendations: BookRecommendation[]) => void;
  setLibrary: (library: BookMetadata[]) => void;
  setSelectedBook: (book?: BookMetadata) => void;
  setDictionary: (dictionary: DictionaryEntry[]) => void;
  setStats: (stats: ReadingStats) => void;
};

export const useAppStore = create<AppState>((set) => ({
  nav: "library",
  recommendations: [],
  library: [],
  dictionary: [],
  stats: {
    streakDays: 12,
    pagesPerDay: [20, 16, 30, 28, 10, 22, 34],
    wordsLearned: 420,
    wordsMastered: 310,
    wordsReviewing: 110,
    minutesRead: 690
  },
  setNav: (nav) => set({ nav }),
  setProfile: (profile) => set({ profile }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setLibrary: (library) => set({ library }),
  setSelectedBook: (selectedBook) => set({ selectedBook, nav: selectedBook ? "reader" : "library" }),
  setDictionary: (dictionary) => set({ dictionary }),
  setStats: (stats) => set({ stats })
}));

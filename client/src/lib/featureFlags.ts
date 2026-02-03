export type FeatureFlagKey =
  | "readerSegmentation"
  | "dictionaryAudio"
  | "gamesAdaptiveDifficulty"
  | "offlineFirst";

export const featureFlags: Record<FeatureFlagKey, boolean> = {
  readerSegmentation: true,
  dictionaryAudio: true,
  gamesAdaptiveDifficulty: true,
  offlineFirst: true
};

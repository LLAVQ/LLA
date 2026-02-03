import { OnboardingFlow } from "@/features/onboarding/OnboardingFlow";
import { LibraryView } from "@/features/library/LibraryView";
import { ReaderView } from "@/features/reader/ReaderView";
import { StatsDashboard } from "@/features/stats/StatsDashboard";

export function HomeView() {
  return (
    <div className="space-y-12">
      <OnboardingFlow />
      <LibraryView />
      <ReaderView />
      <StatsDashboard />
    </div>
  );
}

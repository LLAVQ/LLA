import type { LanguageProfile } from "../types";
import { aiClient } from "../api/aiClient";

export type PipelineStep = {
  label: string;
  status: "pending" | "active" | "done";
};

export const buildOnboardingPipeline = () => [
  { label: "Thinking…", status: "pending" },
  { label: "Analyzing your preferences…", status: "pending" },
  { label: "AI at work…", status: "pending" },
  { label: "Searching books…", status: "pending" },
  { label: "Finding previews…", status: "pending" }
] satisfies PipelineStep[];

export const runRecommendationPipeline = async (
  profile: LanguageProfile,
  onStepChange: (steps: PipelineStep[]) => void
) => {
  const steps = buildOnboardingPipeline();
  const update = (index: number, status: PipelineStep["status"]) => {
    steps[index] = { ...steps[index], status };
    onStepChange([...steps]);
  };

  update(0, "active");
  await new Promise((resolve) => setTimeout(resolve, 400));
  update(0, "done");
  update(1, "active");
  await new Promise((resolve) => setTimeout(resolve, 400));
  update(1, "done");
  update(2, "active");
  const recommendations = await aiClient.generateRecommendations(profile);
  update(2, "done");
  update(3, "active");
  await new Promise((resolve) => setTimeout(resolve, 400));
  update(3, "done");
  update(4, "active");
  await new Promise((resolve) => setTimeout(resolve, 400));
  update(4, "done");

  return recommendations;
};

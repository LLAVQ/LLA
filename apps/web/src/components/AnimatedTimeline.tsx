import { motion } from "framer-motion";
import type { PipelineStep } from "../app/orchestration/pipeline";

const statusStyles: Record<PipelineStep["status"], string> = {
  pending: "text-white/40",
  active: "text-aurora",
  done: "text-emerald-300"
};

export const AnimatedTimeline = ({ steps }: { steps: PipelineStep[] }) => (
  <div className="space-y-3">
    {steps.map((step) => (
      <motion.div
        key={step.label}
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.span
          className={`h-2 w-2 rounded-full ${
            step.status === "active" ? "bg-aurora shadow-glow" : "bg-white/20"
          }`}
          animate={step.status === "active" ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 1.2, repeat: step.status === "active" ? Infinity : 0 }}
        />
        <span className={`text-sm ${statusStyles[step.status]}`}>{step.label}</span>
      </motion.div>
    ))}
  </div>
);

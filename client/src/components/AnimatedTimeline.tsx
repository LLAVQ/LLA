import { motion } from "framer-motion";

interface AnimatedTimelineProps {
  steps: string[];
  activeStep: number;
}

export function AnimatedTimeline({ steps, activeStep }: AnimatedTimelineProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isComplete = index < activeStep;

        return (
          <div key={step} className="flex items-center gap-4">
            <motion.div
              className={`h-3 w-3 rounded-full ${
                isComplete ? "bg-mint-400" : isActive ? "bg-accent-400" : "bg-white/20"
              }`}
              animate={isActive ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ repeat: isActive ? Infinity : 0, duration: 1.2 }}
            />
            <div className="flex-1">
              <p className={`text-sm ${isActive ? "text-white" : "text-white/60"}`}>{step}</p>
              <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                <motion.div
                  className="h-1 rounded-full bg-accent-400"
                  initial={{ width: 0 }}
                  animate={{ width: isComplete ? "100%" : isActive ? "60%" : "0%" }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

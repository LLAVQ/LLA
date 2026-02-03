import { motion } from "framer-motion";

export const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2 w-full rounded-full bg-white/10">
    <motion.div
      className="h-2 rounded-full bg-gradient-to-r from-aurora to-indigo-500"
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.6 }}
    />
  </div>
);

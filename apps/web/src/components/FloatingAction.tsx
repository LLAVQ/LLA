import { motion } from "framer-motion";

export const FloatingAction = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    type="button"
    className="fixed right-6 top-6 z-40 rounded-full bg-gradient-to-r from-aurora to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-glow"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    ➕ Languages &amp; Interests
  </motion.button>
);

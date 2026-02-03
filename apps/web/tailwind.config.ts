import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0b0f1a",
        aurora: "#7c9cff",
        ink: "#111827"
      },
      boxShadow: {
        glow: "0 0 30px rgba(124, 156, 255, 0.35)"
      }
    }
  },
  plugins: []
} satisfies Config;

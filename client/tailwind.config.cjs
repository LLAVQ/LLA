/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          900: "#0B0C10",
          800: "#141821",
          700: "#202838"
        },
        accent: {
          500: "#7C5CFF",
          400: "#9E88FF",
          300: "#C0B2FF"
        },
        mint: {
          400: "#3EE6C2",
          500: "#1CD4A7"
        }
      },
      boxShadow: {
        glow: "0 0 35px rgba(124, 92, 255, 0.35)"
      }
    }
  },
  plugins: []
};

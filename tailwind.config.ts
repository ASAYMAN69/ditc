import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#0e9f6e",
          600: "#0b8457",
          700: "#096b47",
        },
        ink: "#18181b",
      },
      fontFamily: {
        display: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        body: ["system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

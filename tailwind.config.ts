import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        // Official VDF navy (#002e76, sampled from the logo) as a usable ramp.
        brand: {
          50: "#eef2fb",
          100: "#d5e0f3",
          200: "#a9c0e6",
          500: "#11458f",
          600: "#073a82",
          700: "#002e76",
        },
        // Official VDF gold (#c29756, sampled from the logo flag accent).
        gold: {
          400: "#d2ab6f",
          500: "#c29756",
          600: "#a87f3f",
        },
      },
      fontFamily: {
        // Be Vietnam Pro (loaded via next/font in app/layout.tsx) — a Vietnamese-
        // designed typeface with full diacritic coverage and real character.
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        cjk: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', "sans-serif"],
      },
      // Navy-tinted shadows (#002e76) instead of pure black — softer, more premium
      // depth that matches the brand surface hue.
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,46,118,0.05), 0 2px 8px -2px rgba(0,46,118,0.08)",
        "card-lg": "0 10px 28px -8px rgba(0,46,118,0.16), 0 2px 6px -2px rgba(0,46,118,0.08)",
        "card-hover": "0 8px 20px -6px rgba(0,46,118,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;

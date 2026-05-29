import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b9d0ff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
        gold: {
          400: "#d6b34a",
          500: "#c9a227",
          600: "#a9851c",
        },
      },
      fontFamily: {
        cjk: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

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
        cjk: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

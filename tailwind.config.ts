import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#964B00",
        secondary: "#6F4E37",
        tertiary: "#808080",
      },
      fontFamily: {
        roob: ["var(--font-roob)"],
      },
    },
  },
  plugins: [],
};
export default config;

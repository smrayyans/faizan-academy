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
        primary: "#C0392B",
        "primary-dark": "#96281B",
        secondary: "#1E6B1E",
        "secondary-dark": "#155215",
        cream: "#F5E6C8",
        "cream-dark": "#E8D4A8",
        dark: "#0D0D0D",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

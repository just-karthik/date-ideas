import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF9",
        foreground: "#1a1a1a",
        primary: "#4A1D96",
        secondary: "#FDA4AF",
        accent: "#7C3AED",
        plum: "#4A1D96",
        rose: "#FDA4AF",
        "rose-dark": "#FB7185", // A slightly darker, more vibrant rose for icons
        warm: "#FAFAF9",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Include all files in the app directory
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Include all components
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Custom background color using CSS variables
        foreground: "var(--foreground)", // Custom foreground color using CSS variables
      },
    },
  },
  plugins: [],
} satisfies Config;

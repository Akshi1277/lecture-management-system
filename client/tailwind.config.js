/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#10B981", // Emerald
          secondary: "#3B82F6", // Slate Blue
          accent: "#F59E0B",   // Amber
        },
      },
    },
  },
  plugins: [],
};

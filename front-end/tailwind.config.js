/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      zIndex: {
        max: 999,
      },
      keyframes: {
        progressBarShrink: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
      animation: {
        "progress-bar": "progressBarShrink 5000ms linear",
      },
    },
    fontFamily: {
      alternates: ["Montserrat Alternates", "sans-serif"],
      normal: ["Montserrat", "sans-serif"],
    }
  },
  plugins: [],
};


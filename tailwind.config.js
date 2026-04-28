/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mood-pink': '#ffd1dc',
        'mood-blue': '#b6e3f4',
        'mood-purple': '#e0b0ff',
      }
    },
  },
  plugins: [],
}

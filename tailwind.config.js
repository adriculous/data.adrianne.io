/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./assets/**/*.js",
    "./themes/**/layouts/**/*.html",
  ],
  safelist: [
    'bg-bubblegum'
  ],
  theme: {
    extend: {
      colors: {
        bubblegum: "#E9D5FF", // pastel lavender (tweak if you want brighter/darker)
      },
      fontFamily: {
        heading: ['"Special Elite"', 'cursive'], // 👈 add this
        body: ['Inter', 'sans-serif'], // 👈 optional fallback for body text
      },
    },
  },
  plugins: [],
}
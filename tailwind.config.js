/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#2a73c5',
          500: '#2a73c5',
          600: 'red',
        },
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{htm,html,js}"],
  theme: {
    extend: {
      screens: {
        'nav-break': '1250px',
      },
      height: {
        'nav': '72px',
      },
      spacing: {
        'nav': '72px',
      },
    },
  },
  plugins: [],
}

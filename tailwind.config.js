/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // darkMode: ['class', '[data-mode="dark"]'],
  content: [
    "./src/**/*.{html,ts}", './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {

    extend: {
      fontFamily: {
        'sans': ['Raleway-Regular', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        highlight1: '#EA4C3C'
      }
    },

  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}

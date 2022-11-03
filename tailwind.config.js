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
        'sans': ['Montserrat-Regular', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        highlight1: '#EA4C3C',
        highlight2: '#da7d56',
        highlight3: '#fdea9d',
      }
    },

  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}

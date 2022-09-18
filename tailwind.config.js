/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // darkMode: ['class', '[data-mode="dark"]'],
  content: [
    "./src/**/*.{html,ts}", './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {

    extend: {},
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}

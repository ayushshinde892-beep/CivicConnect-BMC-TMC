/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        municipal: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a5f7',
          500: '#0c87eb',
          600: '#026bc9',
          700: '#0255a3',
          800: '#064886',
          900: '#0b3d6f',
          950: '#07264a',
        },
        civicGreen: {
          500: '#10b981',
          600: '#059669',
        },
        bmcNavy: '#0f2942',
        tmcTeal: '#0d7c7c'
      }
    },
  },
  plugins: [],
}

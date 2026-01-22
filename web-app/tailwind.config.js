/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        enfp: {
          dark: '#2e1065', // deep violet (indigo-950 equivalent-ish but warmer)
          light: '#fff7ed', // orange-50 (warm white)
          primary: '#fb7185', // rose-400
          secondary: '#fcd34d', // amber-300
          accent: '#a78bfa', // violet-400
          success: '#34d399', // emerald-400 (softer)
          danger: '#f87171', // red-400 (softer)
          text: '#4c0519', // rose-950 (warm dark text)
          'text-dark': '#fce7f3', // pink-100 (warm light text)
          muted: '#9ca3af', // gray-400
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      }
    },
  },
  plugins: [],
}
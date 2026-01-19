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
        cyber: {
          dark: '#0f172a',
          light: '#1e293b',
          accent: '#0ea5e9', // Sky blue
          success: '#10b981', // Emerald
          danger: '#ef4444', // Red
          text: '#f1f5f9', // Slate 100
          muted: '#94a3b8', // Slate 400
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      }
    },
  },
  plugins: [],
}
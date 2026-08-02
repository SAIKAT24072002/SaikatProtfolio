/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // High premium modern palette
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        dark: {
          bg: '#030712',      // Deep premium dark bg
          card: '#0f172a',    // Dark slate card
          border: '#1e293b',  // Card borders
          text: '#f8fafc',
          textMuted: '#94a3b8'
        },
        light: {
          bg: '#f8fafc',      // Cool slate light bg
          card: '#ffffff',    // White card
          border: '#e2e8f0',  // Light borders
          text: '#0f172a',
          textMuted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

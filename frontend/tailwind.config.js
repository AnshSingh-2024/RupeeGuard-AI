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
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#ff9933',
          600: '#ea580c',
          700: '#c2410c',
        },
        hGreen: {
          50: '#f0fdf4',
          500: '#138808',
          600: '#166534',
          700: '#14532d',
        },
        hBlue: {
          50: '#eff6ff',
          500: '#000080',
          600: '#1e3a8a',
          700: '#172554',
        },
        aiCyan: {
          400: '#22d3ee',
          500: '#00f0ff',
          600: '#0891b2',
          700: '#0e7490',
        },
        cream: {
          50: '#fbfaf5',
          100: '#f5f2e5',
          200: '#eae6d9',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: 0.8 },
          '50%': { transform: 'translateY(100%)', opacity: 0.8 },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.4, filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.4))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 16px rgba(0, 240, 255, 0.8))' },
        },
      }
    },
  },
  plugins: [],
}

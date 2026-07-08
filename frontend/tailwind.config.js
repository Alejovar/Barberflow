/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14120F',
          soft: '#1D1A15',
          border: '#2A251E',
        },
        paper: {
          DEFAULT: '#F5F0E8',
          soft: '#FAF7F2',
          dim: '#EAE3D6',
        },
        brass: {
          DEFAULT: '#B08D57',
          bright: '#00ffdd',
          dark: '#8C6D3F',
        },
        moss: {
          DEFAULT: '#3C4A3E',
          bright: '#516654',
        },
        ash: {
          DEFAULT: '#8A8477',
          light: '#B5AFA2',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
      },
      keyframes: {
        pulseSlot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
      },
      animation: {
        pulseSlot: 'pulseSlot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

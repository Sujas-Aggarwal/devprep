/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Accent — Amber (warm gold, rare in dev tools, distinctive)
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // primary
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Dark surfaces — zinc (warm gray, not cold)
        dark: {
          bg:      '#09090b',  // zinc-950
          surface: '#111113',  // near-black with warmth
          card:    '#18181b',  // zinc-900
          border:  '#27272a',  // zinc-800
          muted:   '#3f3f46',  // zinc-700
        },
        // Light surfaces — zinc (barely cream)
        light: {
          bg:      '#fafafa',  // zinc-50
          surface: '#ffffff',
          card:    '#f4f4f5',  // zinc-100
          border:  '#e4e4e7',  // zinc-200
          muted:   '#a1a1aa',  // zinc-400
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        glow:       '0 0 20px rgba(245, 158, 11, 0.2)',
        'glow-lg':  '0 0 40px rgba(245, 158, 11, 0.25)',
        card:       '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)',
        'card-dark':'0 1px 2px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)',
        'inset-top':'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-up':   'fadeUp 0.18s ease forwards',
        'spin-slow': 'spin 0.7s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

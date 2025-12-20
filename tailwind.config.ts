import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm & Organic Design System
        cream: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#faf0e1',
          300: '#f5e3c8',
          400: '#efd4a8',
          500: '#e5c088',
        },
        forest: {
          50: '#f3f6f3',
          100: '#e3eae2',
          200: '#c7d5c6',
          300: '#a1b89f',
          400: '#7a9b5a',
          500: '#5a7c3a',
          600: '#4a6830',
          700: '#3d5428',
          800: '#334422',
          900: '#2b391d',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#fbe9e1',
          200: '#f8d4c4',
          300: '#f2b69e',
          400: '#e88f6d',
          500: '#dc6b47',
          600: '#c9543a',
          700: '#a84430',
          800: '#8a3a2c',
          900: '#723428',
        },
      },
      fontFamily: {
        // Warm & Organic typography
        nunito: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        fraunces: ['var(--font-fraunces)', 'Georgia', 'serif'],
        // Aliases
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config

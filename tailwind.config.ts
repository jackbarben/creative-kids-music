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
        // Design System: Legit + Different
        // Warm foundation
        cream: {
          50: '#fdfcfa',
          100: '#f9f7f3',
          200: '#f3efe8',
          300: '#e8e2d6',
          400: '#d9d0c0',
          500: '#c9bca6',
        },
        // Grounding neutral (charcoal)
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#3d3d3d',
          900: '#2a2a2a',
          950: '#1a1a1a',
        },
        // From illustration: sage green (leaves)
        sage: {
          50: '#f6f7f4',
          100: '#e9ebe3',
          200: '#d4d9c8',
          300: '#b5bea3',
          400: '#97a37f',
          500: '#7a8862',
          600: '#5f6b4b',
          700: '#4a543c',
          800: '#3d4533',
          900: '#33392c',
        },
        // Warm slate - sophisticated, grounded
        slate: {
          50: '#f8f8f7',
          100: '#f0efed',
          200: '#e2e0dc',
          300: '#d0ccc6',
          400: '#a8a29a',
          500: '#857f76',
          600: '#6b655c',
          700: '#57524a',
          800: '#44403a',
          900: '#353330',
        },
        // From illustration: soft lavender (ribbon)
        lavender: {
          50: '#f8f7fa',
          100: '#f0eef5',
          200: '#e3dfed',
          300: '#cdc5de',
          400: '#b3a5ca',
          500: '#9a88b6',
          600: '#8672a3',
          700: '#725f8c',
          800: '#5f4f74',
          900: '#4f4260',
        },
        // Keep for backward compatibility during transition
        forest: {
          50: '#f6f7f4',
          100: '#e9ebe3',
          200: '#d4d9c8',
          300: '#b5bea3',
          400: '#97a37f',
          500: '#7a8862',
          600: '#5f6b4b',
          700: '#4a543c',
          800: '#3d4533',
          900: '#33392c',
        },
        terracotta: {
          50: '#f9f6f3',
          100: '#f0e9e1',
          200: '#e0d1c2',
          300: '#ccb49c',
          400: '#b69578',
          500: '#a57d5e',
          600: '#8c6548',
          700: '#75523c',
          800: '#614535',
          900: '#513b2f',
        },
      },
      fontFamily: {
        // Typography system
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        // Aliases
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config

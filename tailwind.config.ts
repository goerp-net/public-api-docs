import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c6ff34',
          foreground: '#0a0a0a',
          muted: '#b0e628',
          subtle: '#eef6d6',
        },
        surface: {
          DEFAULT: '#212121',
          card: '#2b2b2b',
          border: '#3a3a3a',
          elevated: '#333333',
        },
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 80px rgba(198, 255, 52, 0.08)',
      },
    },
  },
  plugins: [typography],
} satisfies Config

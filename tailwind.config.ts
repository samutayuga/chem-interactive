import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#1a0a2e',
        cation:  '#00ff88',
        anion:   '#ff4080',
        accent:  '#7040ff',
        surface: '#2a1a4e',
        muted:   '#4a3a6e',
      },
    },
  },
} satisfies Config;

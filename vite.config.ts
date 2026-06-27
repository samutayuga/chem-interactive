import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      '@periodic-table': path.resolve(
        __dirname,
        'src/wasm/pkg/pt_wasm.js'
      ),
      'react-transition-group/TransitionGroupContext': path.resolve(
        __dirname,
        'node_modules/react-transition-group/cjs/TransitionGroupContext.js'
      ),
    },
  },
  build: {
    target: 'esnext',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    server: {
      deps: {
        inline: ['react-transition-group', '@mui/material', '@mui/system', '@mui/utils', '@mui/base'],
      },
    },
  },
});

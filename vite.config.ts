import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      '@periodic-table': path.resolve(
        __dirname,
        '../sam-periodic-table/pkg/pt-wasm/pt_wasm.js'
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
  },
});

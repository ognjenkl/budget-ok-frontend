/// <reference types="vitest" />
import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv('', process.cwd());
const url = env.VITE_API_URL;
const port = env.VITE_API_PORT;
const apiUrl = `${url}:${port}/api`;

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: true,
    exclude: ['**/node_modules/**', '**/test/pact-tests/**', '**/test/playwright-tests/**'],
  },server: {
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

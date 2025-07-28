/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost'),
    'import.meta.env.VITE_API_PORT': JSON.stringify('8090'),
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/contract/setup.ts'],
    include: ['test/contract/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**'],
  },
})

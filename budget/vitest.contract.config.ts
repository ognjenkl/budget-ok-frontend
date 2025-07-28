/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables from .env.contract file
  const env = loadEnv(mode || 'contract', process.cwd(), '');
  
  return {
    plugins: [react()],
    envPrefix: 'VITE_',
    test: {
      globals: true,
      environment: 'node',
      setupFiles: ['./test/contract/setup.ts'],
      include: ['test/contract/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['**/node_modules/**'],
    },
  };
})

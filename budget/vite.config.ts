/// <reference types="vitest" />
import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

const apiUrl = `http://localhost:8090/api`;

export default defineConfig(({ mode }) => {
  // Load environment variables from .env.test file for component tests
  const env = loadEnv(mode || 'test', process.cwd(), '');
  
  return {
    plugins: [react()],
    envPrefix: 'VITE_',
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      css: true,
      exclude: ['**/node_modules/**', '**/test/contract/**', '**/test/acceptance/**'],
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});

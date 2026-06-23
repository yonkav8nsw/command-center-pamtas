import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/command-center-pamtas/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'src/test/**',
        'src/main.jsx',
        '**/*.config.*',
        'dist/**',
      ],
      thresholds: {
        lines:      90,
        functions:  90,
        branches:   80,
        statements: 90,
      },
    },
  },
})

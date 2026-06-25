import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/command-center-pamtas/',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks — pisahkan library besar agar build lebih efisien
          'react-vendor':   ['react', 'react-dom', 'react-router-dom'],
          'leaflet-vendor': ['leaflet', 'react-leaflet'],
          'chart-vendor':   ['recharts'],
          'supabase-vendor':['@supabase/supabase-js'],
        },
      },
    },
  },
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
        // Pages dan komponen UI tidak ditest di unit test (butuh integration/e2e)
        'src/pages/**',
        'src/components/**',
        'src/context/**',
        // api.js punya dummy data fallback (lines 246-299) yang tidak bisa ditest
        // tanpa GAS live — business logic sudah ditest via api.normalization.test.js
        // dan api.fetch.test.js
        'src/services/api.js',
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

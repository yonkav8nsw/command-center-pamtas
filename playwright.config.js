import { defineConfig, devices } from '@playwright/test'
import { readFileSync } from 'fs'

// Load .env file for E2E credentials
function loadEnv() {
  try {
    const envFile = readFileSync('.env', 'utf-8')
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        const value = valueParts.join('=').trim()
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value
        }
      }
    })
  } catch (e) {
    // .env file not found, use defaults
  }
}
loadEnv()

// Base URL: use environment variable or fallback to dev server
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173/command-center-pamtas'

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Desktop Chrome
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    // Tablet (iPad)
    {
      name: 'Tablet iPad',
      use: { ...devices['iPad (gen 7)'] },
    },
    // Mobile (iPhone)
    {
      name: 'Mobile iPhone',
      use: { ...devices['iPhone 13'] },
    },
  ],
})

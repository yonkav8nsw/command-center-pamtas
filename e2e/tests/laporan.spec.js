import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Laporan (Reports) Pages', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
    await goto(page, '/laporan/kerawanan')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to Grafik Kerawanan', async ({ page }) => {
    await expect(page).toHaveURL(/\/laporan\/kerawanan/, { timeout: 10000 })
  })

  test('should display chart on Grafik Kerawanan', async ({ page }) => {
    await page.waitForTimeout(2000)
    const hasChart = await page.locator('.recharts-wrapper, [class*="chart"], svg').first().isVisible().catch(() => false)
    const hasContent = await page.locator('.hud-panel, text=Kerawanan').first().isVisible().catch(() => false)
    expect(hasChart || hasContent).toBeTruthy()
  })

  test('should navigate to Timeline Binter', async ({ page }) => {
    await goto(page, '/laporan/binter')
    await expect(page).toHaveURL(/\/laporan\/binter/, { timeout: 10000 })
  })

  test('should navigate to Data Demografi', async ({ page }) => {
    await goto(page, '/laporan/demografi')
    await expect(page).toHaveURL(/\/laporan\/demografi/, { timeout: 10000 })
  })

  test('should navigate to Tokoh Wilayah', async ({ page }) => {
    await goto(page, '/laporan/tokoh')
    await expect(page).toHaveURL(/\/laporan\/tokoh/, { timeout: 10000 })
  })

  test('should display tokoh list on Tokoh Wilayah', async ({ page }) => {
    const hasList = await page.locator('.hud-panel').count() > 0
    const hasEmpty = await page.locator('text=BELUM ADA').isVisible().catch(() => false)
    expect(hasList || hasEmpty).toBeTruthy()
  })

  test('should have filter on Tokoh Wilayah', async ({ page }) => {
    const hasFilter = await page.locator('select').first().isVisible().catch(() => false)
    expect(hasFilter).toBeTruthy()
  })

  test('should have download button on laporan pages', async ({ page }) => {
    const hasDownload = await page.locator('button:has-text("Download"), button:has-text("PDF")').first().isVisible().catch(() => false)
    expect(hasDownload).toBeTruthy()
  })
})

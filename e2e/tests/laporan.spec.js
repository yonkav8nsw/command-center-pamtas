import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  const adminEmail = process.env.E2E_ADMIN_EMAIL
  const adminPassword = process.env.E2E_ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    test.skip(true, 'Credentials not configured')
  }
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('input[type="email"]', adminEmail)
  await page.fill('input[type="password"]', adminPassword)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 15000 })
})

test.describe('Laporan (Reports) Pages', () => {
  test('should navigate to Grafik Kerawanan', async ({ page }) => {
    await page.goto('/laporan/kerawanan')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/laporan\/kerawanan/)
  })

  test('should display chart on Grafik Kerawanan', async ({ page }) => {
    await page.goto('/laporan/kerawanan')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    await expect(page.locator('.recharts-wrapper, [class*="chart"]').first()).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to Timeline Binter', async ({ page }) => {
    await page.goto('/laporan/binter')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/laporan\/binter/)
  })

  test('should navigate to Data Demografi', async ({ page }) => {
    await page.goto('/laporan/demografi')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/laporan\/demografi/)
  })

  test('should navigate to Tokoh Wilayah', async ({ page }) => {
    await page.goto('/laporan/tokoh')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/laporan\/tokoh/)
  })

  test('should display tokoh list on Tokoh Wilayah', async ({ page }) => {
    await page.goto('/laporan/tokoh')
    await page.waitForLoadState('networkidle')
    const hasList = await page.locator('.hud-panel').count() > 0
    const hasEmpty = await page.locator('text=BELUM ADA DATA').isVisible().catch(() => false)
    expect(hasList || hasEmpty).toBeTruthy()
  })

  test('should have filter on Tokoh Wilayah', async ({ page }) => {
    await page.goto('/laporan/tokoh')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('select').first()).toBeVisible()
  })

  test('should have download button on laporan pages', async ({ page }) => {
    await page.goto('/laporan/kerawanan')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Download")')).toBeVisible()
  })
})

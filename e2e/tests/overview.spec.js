import { test, expect } from '@playwright/test'

// Helper: Login before each test
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

test.describe('Overview Page', () => {
  test('should navigate to overview', async ({ page }) => {
    await page.click('a[href="/overview"]')
    await page.waitForURL('**/overview')
    await expect(page).toHaveURL(/\/overview/)
  })

  test('should display metric cards', async ({ page }) => {
    await page.goto('/overview')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=TOTAL PERSONEL')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=TOTAL POS')).toBeVisible()
  })

  test('should display map container', async ({ page }) => {
    await page.goto('/overview')
    await page.waitForLoadState('networkidle')

    // Map should load (leaflet container)
    await page.waitForSelector('.leaflet-container', { timeout: 15000 })
    await expect(page.locator('.leaflet-container')).toBeVisible()
  })

  test('should display threat panel', async ({ page }) => {
    await page.goto('/overview')
    await page.waitForLoadState('networkidle')

    // Threat panel should exist
    const threatPanel = page.locator('text=/ANCAMAN/i')
    await expect(threatPanel.first()).toBeVisible()
  })

  test('should display binter panel', async ({ page }) => {
    await page.goto('/overview')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=KEGIATAN BINTER')).toBeVisible()
  })

  test('should have zoom controls on map', async ({ page }) => {
    await page.goto('/overview')
    await page.waitForSelector('.leaflet-container', { timeout: 15000 })

    await expect(page.locator('.leaflet-control-zoom-in')).toBeVisible()
    await expect(page.locator('.leaflet-control-zoom-out')).toBeVisible()
  })

  test('should zoom in on map', async ({ page }) => {
    await page.goto('/overview')
    await page.waitForSelector('.leaflet-container', { timeout: 15000 })

    await page.click('.leaflet-control-zoom-in')
    await page.waitForTimeout(500)
  })

  test('should zoom out on map', async ({ page }) => {
    await page.goto('/overview')
    await page.waitForSelector('.leaflet-container', { timeout: 15000 })

    await page.click('.leaflet-control-zoom-out')
    await page.waitForTimeout(500)
  })
})

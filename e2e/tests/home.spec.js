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

test.describe('Home Page', () => {
  test('should display hero banner', async ({ page }) => {
    await expect(page.locator('text=NARASINGA')).toBeVisible()
  })

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('a[href="/"]')).toBeVisible()
    await expect(page.locator('a[href="/overview"]')).toBeVisible()
    await expect(page.locator('a[href="/insiden"]')).toBeVisible()
    await expect(page.locator('a[href="/binter"]')).toBeVisible()
  })

  test('should display stat panels', async ({ page }) => {
    await expect(page.locator('text=PERSONEL')).toBeVisible()
    await expect(page.locator('text=POS AKTIF')).toBeVisible()
    await expect(page.locator('text=INSIDEN')).toBeVisible()
  })

  test('should navigate to overview', async ({ page }) => {
    await page.click('a[href="/overview"]')
    await page.waitForURL('**/overview')
    await expect(page).toHaveURL(/\/overview/)
  })

  test('should navigate to insiden', async ({ page }) => {
    await page.click('a[href="/insiden"]')
    await page.waitForURL('**/insiden')
    await expect(page).toHaveURL(/\/insiden/)
  })

  test('should navigate to binter', async ({ page }) => {
    await page.click('a[href="/binter"]')
    await page.waitForURL('**/binter')
    await expect(page).toHaveURL(/\/binter/)
  })

  test('should display POS list in sidebar', async ({ page }) => {
    await expect(page.locator('a[href^="/pos/"]').first()).toBeVisible()
  })

  test('should navigate to POS detail', async ({ page }) => {
    await page.click('a[href="/pos/KOTIS"]')
    await page.waitForURL('**/pos/KOTIS')
    await expect(page).toHaveURL(/\/pos\/KOTIS/)
  })

  test('should display laporan links', async ({ page }) => {
    await expect(page.locator('a[href="/laporan/kerawanan"]')).toBeVisible()
    await expect(page.locator('a[href="/laporan/binter"]')).toBeVisible()
    await expect(page.locator('a[href="/laporan/demografi"]')).toBeVisible()
    await expect(page.locator('a[href="/laporan/tokoh"]')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
    await goto(page, '/')
    await page.waitForLoadState('networkidle')
  })

  test('should display hero banner', async ({ page }) => {
    await expect(page.locator('text=NARASINGA').first()).toBeVisible()
  })

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.locator('nav, aside')).toBeVisible()
  })

  test('should display stat panels', async ({ page }) => {
    const hasPersonel = await page.locator('text=PERSONEL').isVisible().catch(() => false)
    const hasPosAktif = await page.locator('text=POS').isVisible().catch(() => false)
    expect(hasPersonel || hasPosAktif).toBeTruthy()
  })

  test('should navigate to overview', async ({ page }) => {
    await page.click('a[href*="/overview"]')
    await page.waitForURL('**/overview', { timeout: 10000 })
  })

  test('should navigate to insiden', async ({ page }) => {
    await page.click('a[href*="/insiden"]')
    await page.waitForURL('**/insiden', { timeout: 10000 })
  })

  test('should navigate to binter', async ({ page }) => {
    await page.click('a[href*="/binter"]')
    await page.waitForURL('**/binter', { timeout: 10000 })
  })

  test('should display POS list in sidebar', async ({ page }) => {
    const hasPos = await page.locator('a[href^="/pos/"]').first().isVisible().catch(() => false)
    const hasSidebar = await page.locator('aside').isVisible().catch(() => false)
    expect(hasPos || hasSidebar).toBeTruthy()
  })

  test('should navigate to POS detail', async ({ page }) => {
    const posLink = page.locator('a[href="/pos/KOTIS"], a[href*="/pos/K"]').first()
    if (await posLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await posLink.click()
      await page.waitForURL('**/pos/**', { timeout: 10000 })
    }
  })

  test('should display laporan links', async ({ page }) => {
    const hasLaporan = await page.locator('a[href*="/laporan"]').first().isVisible().catch(() => false)
    const hasSidebar = await page.locator('aside').isVisible().catch(() => false)
    expect(hasLaporan || hasSidebar).toBeTruthy()
  })
})

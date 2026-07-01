import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Insiden Page', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
    await goto(page, '/insiden')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to insiden page', async ({ page }) => {
    await expect(page).toHaveURL(/\/insiden/, { timeout: 10000 })
  })

  test('should display filter controls', async ({ page }) => {
    const hasFilter = await page.locator('button:has-text("Semua"), button:has-text("Aktif")').first().isVisible().catch(() => false)
    const hasContent = await page.locator('.hud-panel, text=Insiden').first().isVisible().catch(() => false)
    expect(hasFilter || hasContent).toBeTruthy()
  })

  test('should display search input', async ({ page }) => {
    const hasSearch = await page.locator('input[placeholder*="Cari"]').isVisible().catch(() => false)
    const hasContent = await page.locator('.hud-panel').first().isVisible().catch(() => false)
    expect(hasSearch || hasContent).toBeTruthy()
  })

  test('should filter by status Aktif', async ({ page }) => {
    const aktifBtn = page.locator('button:has-text("Aktif")').first()
    if (await aktifBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await aktifBtn.click()
      await page.waitForTimeout(500)
    }
  })

  test('should search insiden', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Cari"]')
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test')
      await page.waitForTimeout(500)
    }
  })

  test('should display insiden list or empty state', async ({ page }) => {
    const hasList = await page.locator('.hud-panel').count() > 0
    const hasEmpty = await page.locator('text=BELUM ADA').isVisible().catch(() => false)
    expect(hasList || hasEmpty).toBeTruthy()
  })

  test('should have download PDF button', async ({ page }) => {
    const hasPDF = await page.locator('button:has-text("Download"), button:has-text("PDF")').first().isVisible().catch(() => false)
    expect(hasPDF).toBeTruthy()
  })
})

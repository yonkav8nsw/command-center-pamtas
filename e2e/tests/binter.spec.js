import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Binter Page', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
    await goto(page, '/binter')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to binter page', async ({ page }) => {
    await expect(page).toHaveURL(/\/binter/, { timeout: 10000 })
  })

  test('should display filter controls', async ({ page }) => {
    await expect(page.locator('select').first()).toBeVisible({ timeout: 10000 })
  })

  test('should display search input', async ({ page }) => {
    await expect(page.locator('input[placeholder*="Cari"]')).toBeVisible()
  })

  test('should filter by timeline', async ({ page }) => {
    const selects = page.locator('select')
    await selects.first().selectOption('7d')
    await page.waitForTimeout(500)
  })

  test('should display binter list or empty state', async ({ page }) => {
    const hasList = await page.locator('.hud-panel').count() > 0
    const hasEmpty = await page.locator('text=BELUM ADA DATA').isVisible().catch(() => false)
    expect(hasList || hasEmpty).toBeTruthy()
  })

  test('should have download PDF button', async ({ page }) => {
    await expect(page.locator('button:has-text("Download PDF")')).toBeVisible()
  })
})

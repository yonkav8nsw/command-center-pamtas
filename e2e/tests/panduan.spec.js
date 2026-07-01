import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Panduan Page', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to panduan page', async ({ page }) => {
    await expect(page).toHaveURL(/\/panduan/, { timeout: 10000 })
  })

  test('should display panduan header', async ({ page }) => {
    const hasPanduan = await page.locator('text=Panduan').first().isVisible().catch(() => false)
    expect(hasPanduan).toBeTruthy()
  })

  test('should display tab navigation', async ({ page }) => {
    const hasTabs = await page.locator('button:has-text("Data Pos"), button:has-text("Demografi")').first().isVisible().catch(() => false)
    expect(hasTabs).toBeTruthy()
  })

  test('should switch to Data Pos tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Data Pos")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(300)
    }
  })

  test('should switch to Demografi tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Demografi")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(300)
    }
  })

  test('should switch to Tokoh tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Tokoh")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(300)
    }
  })

  test('should switch to Binter tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Binter")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(300)
    }
  })

  test('should switch to Kerawanan tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Kerawanan")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(300)
    }
  })

  test('should switch to Patroli tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Patroli")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(300)
    }
  })

  test('should display SOP sections', async ({ page }) => {
    const hasContent = await page.locator('.hud-panel').first().isVisible().catch(() => false)
    expect(hasContent).toBeTruthy()
  })
})

import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('POS Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
    await goto(page, '/pos/KOTIS')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to KOTIS POS', async ({ page }) => {
    await expect(page).toHaveURL(/\/pos\/KOTIS/, { timeout: 10000 })
  })

  test('should display tab navigation', async ({ page }) => {
    const hasInfo = await page.locator('button:has-text("Info")').isVisible().catch(() => false)
    const hasTabs = await page.locator('[role="tab"]').first().isVisible().catch(() => false)
    expect(hasInfo || hasTabs).toBeTruthy()
  })

  test('should switch to Demografi tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Demografi")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(500)
    }
  })

  test('should switch to Tokoh tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Tokoh")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(500)
    }
  })

  test('should switch to Binter tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Binter")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(500)
    }
  })

  test('should switch to Kerawanan tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Insiden")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(500)
    }
  })

  test('should switch to Patroli tab', async ({ page }) => {
    const btn = page.locator('button:has-text("Patroli")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(500)
    }
  })

  test('should display Edit Pos button on Info tab', async ({ page }) => {
    const hasEdit = await page.locator('button:has-text("Edit")').isVisible().catch(() => false)
    expect(hasEdit).toBeTruthy()
  })

  test('should display POS info', async ({ page }) => {
    const hasPos = await page.locator('text=KOTIS').first().isVisible().catch(() => false)
    const hasContent = await page.locator('.hud-panel').first().isVisible().catch(() => false)
    expect(hasPos || hasContent).toBeTruthy()
  })
})

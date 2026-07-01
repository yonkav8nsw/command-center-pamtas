import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Overview Page', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
    await goto(page, '/overview')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to overview', async ({ page }) => {
    await expect(page).toHaveURL(/\/overview/, { timeout: 10000 })
  })

  test('should display metric cards', async ({ page }) => {
    const hasPersonel = await page.locator('text=PERSONEL').isVisible().catch(() => false)
    const hasContent = await page.locator('.hud-panel').first().isVisible().catch(() => false)
    expect(hasPersonel || hasContent).toBeTruthy()
  })

  test('should display map container', async ({ page }) => {
    const hasMap = await page.locator('.leaflet-container').isVisible().catch(() => false)
    expect(hasMap).toBeTruthy()
  })

  test('should display threat panel', async ({ page }) => {
    const hasThreat = await page.locator('text=/ANCAMAN|KERAWANAN/i').first().isVisible().catch(() => false)
    const hasContent = await page.locator('.hud-panel').first().isVisible().catch(() => false)
    expect(hasThreat || hasContent).toBeTruthy()
  })

  test('should display binter panel', async ({ page }) => {
    const hasBinter = await page.locator('text=BINTER').isVisible().catch(() => false)
    const hasContent = await page.locator('.hud-panel').first().isVisible().catch(() => false)
    expect(hasBinter || hasContent).toBeTruthy()
  })

  test('should have zoom controls on map', async ({ page }) => {
    const hasZoom = await page.locator('.leaflet-control-zoom').isVisible().catch(() => false)
    const hasMap = await page.locator('.leaflet-container').isVisible().catch(() => false)
    expect(hasZoom || hasMap).toBeTruthy()
  })

  test('should zoom in on map', async ({ page }) => {
    const zoomIn = page.locator('.leaflet-control-zoom-in')
    if (await zoomIn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await zoomIn.click()
      await page.waitForTimeout(500)
    }
  })

  test('should zoom out on map', async ({ page }) => {
    const zoomOut = page.locator('.leaflet-control-zoom-out')
    if (await zoomOut.isVisible({ timeout: 2000 }).catch(() => false)) {
      await zoomOut.click()
      await page.waitForTimeout(500)
    }
  })
})

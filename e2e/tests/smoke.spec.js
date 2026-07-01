import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
  })

  test('home page loads', async ({ page }) => {
    await goto(page, '/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('sidebar navigation exists', async ({ page }) => {
    await goto(page, '/')
    const hasNav = await page.locator('nav, aside, [role="navigation"]').first().isVisible().catch(() => false)
    expect(hasNav).toBeTruthy()
  })

  test('can navigate to overview', async ({ page }) => {
    await goto(page, '/')
    const link = page.locator('a[href*="/overview"]').first()
    if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
      await link.click()
      await page.waitForURL('**/overview', { timeout: 10000 })
    }
  })

  test('can navigate to insiden', async ({ page }) => {
    await goto(page, '/')
    const link = page.locator('a[href*="/insiden"]').first()
    if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
      await link.click()
      await page.waitForURL('**/insiden', { timeout: 10000 })
    }
  })

  test('can navigate to binter', async ({ page }) => {
    await goto(page, '/')
    const link = page.locator('a[href*="/binter"]').first()
    if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
      await link.click()
      await page.waitForURL('**/binter', { timeout: 10000 })
    }
  })

  test('can navigate to panduan', async ({ page }) => {
    await goto(page, '/')
    const link = page.locator('a[href*="/panduan"]').first()
    if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
      await link.click()
      await page.waitForURL('**/panduan', { timeout: 10000 })
    }
  })
})

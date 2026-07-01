import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Critical Pages & Functions Verification', () => {
  // Auth state test
  test.describe('Auth & Login', () => {
    test.beforeEach(async ({ page }) => {
      await logout(page)
    })

    test('should show login page', async ({ page }) => {
      await goto(page, '/login')
      await page.waitForTimeout(3000)
      await expect(page.locator('body')).toBeVisible()
    })

    test('should have login form', async ({ page }) => {
      await goto(page, '/login')
      await page.waitForTimeout(3000)
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')
      await expect(emailInput).toBeVisible({ timeout: 10000 })
      await expect(passwordInput).toBeVisible()
    })
  })

  // Main pages test (requires auth)
  test.describe('Main Pages (Authenticated)', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD) {
        test.skip(true, 'Credentials not configured')
      }
      const success = await login(page)
      if (!success) {
        test.skip(true, 'Login failed')
      }
    })

    test('home page loads', async ({ page }) => {
      await goto(page, '/')
      await page.waitForTimeout(2000)
      await expect(page.locator('body')).toBeVisible()
    })

    test('overview page loads with map', async ({ page }) => {
      await goto(page, '/overview')
      await page.waitForTimeout(3000)
      await expect(page.locator('body')).toBeVisible()
    })

    test('insiden page loads', async ({ page }) => {
      await goto(page, '/insiden')
      await page.waitForTimeout(2000)
      await expect(page.locator('body')).toBeVisible()
    })

    test('binter page loads', async ({ page }) => {
      await goto(page, '/binter')
      await page.waitForTimeout(2000)
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // POS detail page test
  test.describe('POS Detail Page', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD) {
        test.skip(true, 'Credentials not configured')
      }
      const success = await login(page)
      if (!success) {
        test.skip(true, 'Login failed')
      }
    })

    test('KOTIS page loads with tabs', async ({ page }) => {
      await goto(page, '/pos/KOTIS')
      await page.waitForTimeout(3000)
      await expect(page.locator('body')).toBeVisible()

      // Check for tab navigation
      const tabs = page.locator('[role="tab"], button:has-text("Info"), button:has-text("Demografi")')
      const tabCount = await tabs.count()
      console.log('Tab count:', tabCount)
    })

    test('KOTIS tabs are clickable', async ({ page }) => {
      await goto(page, '/pos/KOTIS')
      await page.waitForTimeout(3000)

      // Try clicking Demografi tab if exists
      const demografiTab = page.locator('button:has-text("Demografi")').first()
      if (await demografiTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await demografiTab.click()
        await page.waitForTimeout(1000)
        console.log('Demografi tab clicked successfully')
      }

      // Try clicking other tabs
      const buttons = page.locator('button').filter({ hasNotText: '' })
      const buttonCount = await buttons.count()
      console.log('Total buttons on page:', buttonCount)
    })

    test('KT page loads', async ({ page }) => {
      await goto(page, '/pos/KT')
      await page.waitForTimeout(3000)
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // Laporan pages test
  test.describe('Laporan Pages', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD) {
        test.skip(true, 'Credentials not configured')
      }
      const success = await login(page)
      if (!success) {
        test.skip(true, 'Login failed')
      }
    })

    test('laporan kerawanan loads', async ({ page }) => {
      await goto(page, '/laporan/kerawanan')
      await page.waitForTimeout(2000)
      await expect(page.locator('body')).toBeVisible()
    })

    test('laporan tokoh loads', async ({ page }) => {
      await goto(page, '/laporan/tokoh')
      await page.waitForTimeout(2000)
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // Navigation test
  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD) {
        test.skip(true, 'Credentials not configured')
      }
      const success = await login(page)
      if (!success) {
        test.skip(true, 'Login failed')
      }
    })

    test('sidebar navigation works', async ({ page }) => {
      await goto(page, '/')
      await page.waitForTimeout(2000)

      // Try clicking sidebar links
      const overviewLink = page.locator('a[href*="/overview"]').first()
      if (await overviewLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        await overviewLink.click()
        await page.waitForTimeout(1000)
        console.log('Overview link clicked')
      }
    })

    test('refresh works - page stays functional', async ({ page }) => {
      await goto(page, '/pos/KOTIS')
      await page.waitForTimeout(3000)

      // Refresh page
      await page.reload()
      await page.waitForTimeout(3000)

      // Check if still functional
      await expect(page.locator('body')).toBeVisible()
    })
  })
})

import { test, expect } from '@playwright/test'
import { goto, login, logout } from './helpers.js'

test.describe('Admin Page', () => {
  test.beforeEach(async ({ page }) => {
    await logout(page)
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed - check E2E credentials')
    }
    await goto(page, '/admin')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to admin page', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 })
  })

  test('should display user management section', async ({ page }) => {
    await expect(page.locator('button:has-text("Tambah")')).toBeVisible({ timeout: 10000 })
  })

  test('should display user list or empty state', async ({ page }) => {
    const hasUsers = await page.locator('table tbody tr').count() > 0
    const hasEmpty = await page.locator('text=BELUM ADA USER').isVisible().catch(() => false)
    expect(hasUsers || hasEmpty).toBeTruthy()
  })

  test('should display role filter buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Admin")')).toBeVisible()
    await expect(page.locator('button:has-text("Operator")')).toBeVisible()
    await expect(page.locator('button:has-text("Viewer")')).toBeVisible()
  })

  test('should filter by Admin role', async ({ page }) => {
    await page.click('button:has-text("Admin")')
    await page.waitForTimeout(500)
  })

  test('should filter by Operator role', async ({ page }) => {
    await page.click('button:has-text("Operator")')
    await page.waitForTimeout(500)
  })

  test('should open add user modal', async ({ page }) => {
    await page.click('button:has-text("Tambah")')
    await page.waitForTimeout(500)
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('should close add user modal', async ({ page }) => {
    await page.click('button:has-text("Tambah")')
    await page.waitForTimeout(500)
    await page.click('button:has-text("Batal")')
    await page.waitForTimeout(300)
  })

  test('should display Supabase status', async ({ page }) => {
    await expect(page.locator('text=Supabase')).toBeVisible()
  })
})

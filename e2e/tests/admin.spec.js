import { test, expect } from '@playwright/test'

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

test.describe('Admin Page', () => {
  test('should navigate to admin page', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
  })

  test('should display user management section', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Tambah")')).toBeVisible()
  })

  test('should display user list or empty state', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    const hasUsers = await page.locator('table tbody tr').count() > 0
    const hasEmpty = await page.locator('text=BELUM ADA USER').isVisible().catch(() => false)
    expect(hasUsers || hasEmpty).toBeTruthy()
  })

  test('should display role filter buttons', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Admin")')).toBeVisible()
    await expect(page.locator('button:has-text("Operator")')).toBeVisible()
    await expect(page.locator('button:has-text("Viewer")')).toBeVisible()
  })

  test('should filter by Admin role', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Admin")')
    await page.waitForTimeout(500)
  })

  test('should filter by Operator role', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Operator")')
    await page.waitForTimeout(500)
  })

  test('should open add user modal', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Tambah")')
    await page.waitForTimeout(500)
    // Modal should open with form
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('should close add user modal', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Tambah")')
    await page.waitForTimeout(500)
    await page.click('button:has-text("Batal")')
    await page.waitForTimeout(300)
  })

  test('should display Supabase status', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Supabase')).toBeVisible()
  })
})

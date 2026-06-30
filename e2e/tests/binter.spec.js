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

test.describe('Binter Page', () => {
  test('should navigate to binter page', async ({ page }) => {
    await page.goto('/binter')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/binter/)
  })

  test('should display filter controls', async ({ page }) => {
    await page.goto('/binter')
    await page.waitForLoadState('networkidle')
    const selects = page.locator('select')
    await expect(selects.first()).toBeVisible()
  })

  test('should display search input', async ({ page }) => {
    await page.goto('/binter')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('input[placeholder*="Cari"]')).toBeVisible()
  })

  test('should filter by timeline', async ({ page }) => {
    await page.goto('/binter')
    await page.waitForLoadState('networkidle')
    const selects = page.locator('select')
    await selects.first().selectOption('7d')
    await page.waitForTimeout(500)
  })

  test('should display binter list or empty state', async ({ page }) => {
    await page.goto('/binter')
    await page.waitForLoadState('networkidle')
    const hasList = await page.locator('.hud-panel').count() > 0
    const hasEmpty = await page.locator('text=BELUM ADA DATA').isVisible().catch(() => false)
    expect(hasList || hasEmpty).toBeTruthy()
  })

  test('should have download PDF button', async ({ page }) => {
    await page.goto('/binter')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Download PDF")')).toBeVisible()
  })
})

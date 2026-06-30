import { test, expect } from '@playwright/test'

// Helper: Login before each test
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

test.describe('Insiden Page', () => {
  test('should navigate to insiden page', async ({ page }) => {
    await page.goto('/insiden')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/insiden/)
  })

  test('should display filter controls', async ({ page }) => {
    await page.goto('/insiden')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Semua")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Aktif")')).toBeVisible()
  })

  test('should display search input', async ({ page }) => {
    await page.goto('/insiden')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('input[placeholder*="Cari"]')).toBeVisible()
  })

  test('should filter by status Aktif', async ({ page }) => {
    await page.goto('/insiden')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Aktif")')
    await page.waitForTimeout(500)
  })

  test('should search insiden', async ({ page }) => {
    await page.goto('/insiden')
    await page.waitForLoadState('networkidle')
    await page.locator('input[placeholder*="Cari"]').fill('test')
    await page.waitForTimeout(500)
  })

  test('should display insiden list or empty state', async ({ page }) => {
    await page.goto('/insiden')
    await page.waitForLoadState('networkidle')
    const hasList = await page.locator('.hud-panel').count() > 0
    const hasEmpty = await page.locator('text=BELUM ADA DATA').isVisible().catch(() => false)
    expect(hasList || hasEmpty).toBeTruthy()
  })

  test('should have download PDF button', async ({ page }) => {
    await page.goto('/insiden')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Download PDF")')).toBeVisible()
  })
})

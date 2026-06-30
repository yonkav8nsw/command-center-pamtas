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

test.describe('POS Detail Page', () => {
  test('should navigate to KOTIS POS', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/pos\/KOTIS/)
  })

  test('should display tab navigation', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Info")')).toBeVisible()
    await expect(page.locator('button:has-text("Demografi")')).toBeVisible()
    await expect(page.locator('button:has-text("Tokoh")')).toBeVisible()
  })

  test('should switch to Demografi tab', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Demografi")')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/pos\/KOTIS\/demografi/)
  })

  test('should switch to Tokoh tab', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Tokoh")')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/pos\/KOTIS\/tokoh/)
  })

  test('should switch to Binter tab', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Binter")')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/pos\/KOTIS\/binter/)
  })

  test('should switch to Kerawanan tab', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Kerawanan")')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/pos\/KOTIS\/kerawanan/)
  })

  test('should switch to Patroli tab', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Patroli")')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/\/pos\/KOTIS\/patroli/)
  })

  test('should display Edit Pos button on Info tab', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Edit Pos")')).toBeVisible()
  })

  test('should display POS info', async ({ page }) => {
    await page.goto('/pos/KOTIS')
    await page.waitForLoadState('networkidle')
    // Should show POS name
    await expect(page.locator('text=KOTIS').first()).toBeVisible()
  })
})

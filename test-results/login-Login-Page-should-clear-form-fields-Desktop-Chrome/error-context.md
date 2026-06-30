# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Login Page >> should clear form fields
- Location: e2e\tests\login.spec.js:59:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - text: The server is configured with a public base URL of /command-center-pamtas/ - did you mean to visit
  - link "/command-center-pamtas/login" [ref=e2] [cursor=pointer]:
    - /url: /command-center-pamtas/login
  - text: instead?
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Login Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login')
  6  |     await page.waitForLoadState('networkidle')
  7  |   })
  8  | 
  9  |   test('should display login form elements', async ({ page }) => {
  10 |     // Header
  11 |     await expect(page.locator('text=NARASINGA OPERATION CENTER')).toBeVisible()
  12 | 
  13 |     // Form labels
  14 |     await expect(page.locator('text=── OPERATOR ID')).toBeVisible()
  15 |     await expect(page.locator('text=── ACCESS KEY')).toBeVisible()
  16 | 
  17 |     // Inputs
  18 |     const emailInput = page.locator('input[type="email"]')
  19 |     const passwordInput = page.locator('input[type="password"]')
  20 |     await expect(emailInput).toBeVisible()
  21 |     await expect(passwordInput).toBeVisible()
  22 | 
  23 |     // Submit button
  24 |     await expect(page.locator('button[type="submit"]')).toBeVisible()
  25 |     await expect(page.locator('text=MASUK SISTEM')).toBeVisible()
  26 |   })
  27 | 
  28 |   test('should login with valid credentials', async ({ page }) => {
  29 |     const adminEmail = process.env.E2E_ADMIN_EMAIL
  30 |     const adminPassword = process.env.E2E_ADMIN_PASSWORD
  31 | 
  32 |     if (!adminEmail || !adminPassword) {
  33 |       test.skip(true, 'Credentials not configured - set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD')
  34 |     }
  35 | 
  36 |     // Fill form
  37 |     await page.fill('input[type="email"]', adminEmail)
  38 |     await page.fill('input[type="password"]', adminPassword)
  39 | 
  40 |     // Submit
  41 |     await page.click('button[type="submit"]')
  42 | 
  43 |     // Should redirect to home (/)
  44 |     await page.waitForURL('**/', { timeout: 15000 })
  45 | 
  46 |     // Home page should load
  47 |     await expect(page.locator('text=◈ NARASINGA')).toBeVisible({ timeout: 10000 })
  48 |   })
  49 | 
  50 |   test('should show validation for invalid email', async ({ page }) => {
  51 |     await page.fill('input[type="email"]', 'invalid-email')
  52 |     await page.fill('input[type="password"]', 'password123')
  53 |     await page.click('button[type="submit"]')
  54 | 
  55 |     // Should show error or prevent submission
  56 |     await page.waitForTimeout(1000)
  57 |   })
  58 | 
  59 |   test('should clear form fields', async ({ page }) => {
> 60 |     await page.fill('input[type="email"]', 'test@example.com')
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  61 |     await page.fill('input[type="password"]', 'password123')
  62 | 
  63 |     // Clear fields
  64 |     await page.locator('input[type="email"]').clear()
  65 |     await page.locator('input[type="password"]').clear()
  66 | 
  67 |     // Verify cleared
  68 |     await expect(page.locator('input[type="email"]')).toHaveValue('')
  69 |     await expect(page.locator('input[type="password"]')).toHaveValue('')
  70 |   })
  71 | })
  72 | 
```
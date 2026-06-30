# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Login Page >> should login with valid credentials
- Location: e2e\tests\login.spec.js:26:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="email"]')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('input[type="email"]')

```

```yaml
- text: The server is configured with a public base URL of /command-center-pamtas/ - did you mean to visit
- link "/command-center-pamtas/login":
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
  7  | 
  8  |     // Wait for form inputs to be visible (boot animation takes ~2-3 seconds)
> 9  |     await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 })
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  10 |     await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 5000 })
  11 |   })
  12 | 
  13 |   test('should display login form elements', async ({ page }) => {
  14 |     // Header - use first() to avoid strict mode violation
  15 |     await expect(page.locator('text=NARASINGA OPERATION CENTER').first()).toBeVisible()
  16 | 
  17 |     // Form labels
  18 |     await expect(page.locator('text=── OPERATOR ID')).toBeVisible()
  19 |     await expect(page.locator('text=── ACCESS KEY')).toBeVisible()
  20 | 
  21 |     // Submit button
  22 |     await expect(page.locator('button[type="submit"]')).toBeVisible()
  23 |     await expect(page.locator('text=MASUK SISTEM')).toBeVisible()
  24 |   })
  25 | 
  26 |   test('should login with valid credentials', async ({ page }) => {
  27 |     const adminEmail = process.env.E2E_ADMIN_EMAIL
  28 |     const adminPassword = process.env.E2E_ADMIN_PASSWORD
  29 | 
  30 |     if (!adminEmail || !adminPassword) {
  31 |       test.skip(true, 'Credentials not configured - set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD')
  32 |     }
  33 | 
  34 |     // Fill form
  35 |     await page.fill('input[type="email"]', adminEmail)
  36 |     await page.fill('input[type="password"]', adminPassword)
  37 | 
  38 |     // Submit
  39 |     await page.click('button[type="submit"]')
  40 | 
  41 |     // Should redirect to home
  42 |     await page.waitForURL('**/command-center-pamtas/**', { timeout: 20000 })
  43 | 
  44 |     // Home page should load
  45 |     await expect(page.locator('text=NARASINGA').first()).toBeVisible({ timeout: 10000 })
  46 |   })
  47 | 
  48 |   test('should show validation for invalid email', async ({ page }) => {
  49 |     await page.fill('input[type="email"]', 'invalid-email')
  50 |     await page.fill('input[type="password"]', 'password123')
  51 |     await page.click('button[type="submit"]')
  52 | 
  53 |     // Should show error or prevent submission
  54 |     await page.waitForTimeout(1000)
  55 |   })
  56 | 
  57 |   test('should clear form fields', async ({ page }) => {
  58 |     await page.fill('input[type="email"]', 'test@example.com')
  59 |     await page.fill('input[type="password"]', 'password123')
  60 | 
  61 |     // Clear fields
  62 |     await page.locator('input[type="email"]').clear()
  63 |     await page.locator('input[type="password"]').clear()
  64 | 
  65 |     // Verify cleared
  66 |     await expect(page.locator('input[type="email"]')).toHaveValue('')
  67 |     await expect(page.locator('input[type="password"]')).toHaveValue('')
  68 |   })
  69 | })
  70 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: quick.spec.js >> Dashboard Pages (Authenticated) >> admin page loads
- Location: e2e\tests\quick.spec.js:59:3

# Error details

```
Error: Credentials not configured
```

# Test source

```ts
  1  | // Test helper constants
  2  | export const BASE_URL = 'http://localhost:5173/command-center-pamtas'
  3  | 
  4  | // Login helper
  5  | export async function login(page) {
  6  |   const adminEmail = process.env.E2E_ADMIN_EMAIL
  7  |   const adminPassword = process.env.E2E_ADMIN_PASSWORD
  8  | 
  9  |   if (!adminEmail || !adminPassword) {
> 10 |     throw new Error('Credentials not configured')
     |           ^ Error: Credentials not configured
  11 |   }
  12 | 
  13 |   await page.goto(`${BASE_URL}/login`)
  14 |   await page.waitForLoadState('domcontentloaded')
  15 | 
  16 |   // Wait for boot animation
  17 |   await page.waitForTimeout(3000)
  18 | 
  19 |   // Fill login form
  20 |   const emailInput = page.locator('input[type="email"]')
  21 |   const passwordInput = page.locator('input[type="password"]')
  22 | 
  23 |   await emailInput.waitFor({ timeout: 10000 })
  24 |   await emailInput.fill(adminEmail)
  25 |   await passwordInput.fill(adminPassword)
  26 |   await page.locator('button[type="submit"]').click()
  27 | 
  28 |   // Wait for redirect
  29 |   await page.waitForTimeout(2000)
  30 | 
  31 |   return page.url().includes('/command-center-pamtas/')
  32 | }
  33 | 
```
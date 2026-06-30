import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { TEST_USERS } from './fixtures/auth'

test.describe('Authentication', () => {
  let loginPage
  let homePage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    homePage = new HomePage(page)
  })

  test('should display login page with all elements', async () => {
    await loginPage.navigate('/login')

    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.submitButton).toBeVisible()
  })

  test('should show validation errors for empty fields', async () => {
    await loginPage.navigate('/login')
    await loginPage.submitButton.click()

    // Should show required field errors
    await expect(loginPage.emailInput).toBeInvalid()
    await expect(loginPage.passwordInput).toBeInvalid()
  })

  test('should show validation error for invalid email format', async () => {
    await loginPage.navigate('/login')
    await loginPage.fill('input[type="email"]', 'invalid-email')
    await loginPage.fill('input[type="password"]', 'password123')
    await loginPage.submitButton.click()

    await loginPage.expectEmailValidationError()
  })

  test('should show validation error for short password', async () => {
    await loginPage.navigate('/login')
    await loginPage.fill('input[type="email"]', 'user@test.com')
    await loginPage.fill('input[type="password"]', 'short')
    await loginPage.submitButton.click()

    await loginPage.expectPasswordRequiredError()
  })

  test('should redirect to home after successful login', async ({ page }) => {
    await loginPage.navigate('/login')

    // Note: This test requires valid credentials
    // Skip if running without real auth
    if (!process.env.E2E_ADMIN_EMAIL) {
      test.skip(true, 'Requires real credentials')
    }

    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    await loginPage.expectRedirectToHome()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.navigate('/login')
    await loginPage.login('wrong@test.com', 'wrongpassword')

    // Should show error message or stay on login page
    const currentUrl = page.url()
    const isOnLogin = currentUrl.includes('/login')
    const hasError = await loginPage.errorMessage.isVisible().catch(() => false)

    expect(isOnLogin || hasError).toBeTruthy()
  })

  test('should have terminal boot animation', async () => {
    await loginPage.navigate('/login')
    await loginPage.expectTerminalBoot()
  })
})

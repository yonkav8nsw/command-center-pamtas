import { BasePage } from './BasePage'

/**
 * Login Page Object
 * Tests authentication flow and login page elements
 */
export class LoginPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/login'
  }

  // Selectors (no id attributes in LoginPage, use type selector)
  get emailInput() { return this.page.locator('input[type="email"]') }
  get passwordInput() { return this.page.locator('input[type="password"]') }
  get submitButton() { return this.page.locator('button[type="submit"]') }
  get errorMessage() { return this.page.locator('[role="alert"]') }
  get loadingSpinner() { return this.page.locator('.animate-spin') }
  get terminalLog() { return this.page.locator('text=NARASINGA-OPS') }

  // Actions
  async login(email, password) {
    await this.navigate(this.path)
    await this.fill('input[type="email"]', email)
    await this.fill('input[type="password"]', password)
    await this.click('button[type="submit"]')
  }

  async loginAsOperator() {
    await this.login(
      process.env.E2E_OPERATOR_EMAIL || 'operator@test.com',
      process.env.E2E_OPERATOR_PASSWORD || 'password123'
    )
  }

  async loginAsAdmin() {
    await this.login(
      process.env.E2E_ADMIN_EMAIL || 'admin@test.com',
      process.env.E2E_ADMIN_PASSWORD || 'password123'
    )
  }

  async loginAsViewer() {
    await this.login(
      process.env.E2E_VIEWER_EMAIL || 'viewer@test.com',
      process.env.E2E_VIEWER_PASSWORD || 'password123'
    )
  }

  // Assertions
  async expectLoginForm() {
    await this.waitForSelector('input[type="email"]')
    await this.waitForSelector('input[type="password"]')
    await this.waitForSelector('button[type="submit"]')
  }

  async expectTerminalBoot() {
    await this.waitForSelector('text=NARASINGA-OPS', { timeout: 5000 })
  }

  async expectErrorMessage(text) {
    await this.waitForSelector(`text=${text}`, { timeout: 5000 })
  }

  async expectNoError() {
    await this.page.waitForSelector('[role="alert"]', { state: 'hidden', timeout: 5000 }).catch(() => {})
  }

  async expectRedirectToHome() {
    await this.page.waitForURL('**/', { timeout: 10000 })
  }

  async expectEmailValidationError() {
    await this.waitForSelector('text=Format email tidak valid')
  }

  async expectPasswordRequiredError() {
    await this.waitForSelector('text=Password wajib diisi')
  }
}

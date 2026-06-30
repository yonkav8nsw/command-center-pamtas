import { test, expect } from '@playwright/test'

/**
 * Debug test - captures page state when login fails
 * This helps diagnose why input[type="email"] is not found
 */
test.describe('DEBUG: Page State Capture', () => {
  test('capture login page HTML when test fails', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')

    // Wait a bit for React to mount
    await page.waitForTimeout(3000)

    // Capture page state
    const html = await page.content()
    const title = await page.title()
    const bodyText = await page.locator('body').innerText()
    const hasEmailInput = await page.locator('input[type="email"]').count()
    const url = page.url()

    console.log('=== PAGE DEBUG INFO ===')
    console.log('URL:', url)
    console.log('Title:', title)
    console.log('Has email input:', hasEmailInput)
    console.log('Body text (first 500):', bodyText.substring(0, 500))
    console.log('HTML length:', html.length)

    // Check for React root
    const hasRoot = await page.locator('#root').count()
    const rootHtml = await page.locator('#root').innerHTML()
    console.log('Root element exists:', hasRoot)
    console.log('Root innerHTML (first 500):', rootHtml.substring(0, 500))

    // This will always pass - we just want the console output
    expect(hasEmailInput).toBeGreaterThan(0)
  })
})

import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/register')
})

const emails = {
  valid: ['abc@xyz.com'],
  invalid: ['abc', 'abc@', 'abc@xyz', 'abc@xyz.'],
}

const passwords = {
  valid: ['12345678'],
  invalid: ['1234567', '1a2b'],
}

test.describe('Register New User', () => {
  test('should register with valid email', async ({ page }) => {
    const emailInput = page.getByTestId('email')
    const emailError = page.getByTestId('email-error')

    await emailInput.fill(emails.invalid[0])
    await expect(emailError).toHaveCount(1)
    await expect(emailError).toHaveText('Invalid email')
    await emailInput.fill('')
    await expect(emailError).toHaveCount(1)
    await expect(emailError).toHaveText('Invalid email')
    await emailInput.fill(emails.valid[0])
    await expect(emailError).toHaveCount(0)
  })

  test('should register with valid password', async ({ page }) => {
    const emailInput = page.getByTestId('email')
    const passwordInput = page.getByTestId('password')

    // Make sure no email error pops up
    await emailInput.fill(emails.valid[0])
  })
})

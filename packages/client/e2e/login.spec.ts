import { test, expect, Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

const emails = {
  valid: ['abc@xyz.com'],
  invalid: ['abc', 'abc@', 'abc@xyz', 'abc@xyz.'],
}

const passwords = {
  valid: ['12345678'],
  invalid: ['1234567', '1a2b'],
}

const testemail = `test-${Date.now()}@example.com`
const testpassword = '12345678'

const logout = async (page: Page) => {
  await page.goto('/main')
  await page.getByTestId('logout-button').click()
}

test.describe('Register New User and Login', () => {
  test('should not register with invalid fields', async ({ page }) => {
    // Logged in by default
    await logout(page)

    await page.goto('/register')

    const emailInput = page.getByTestId('email')
    const emailError = page.getByTestId('email-error')

    await emailInput.fill(emails.invalid[0])
    await expect(emailError).toHaveCount(1)
    await expect(emailError).toHaveText('Invalid email')
    await emailInput.fill('')
    await expect(emailError).toHaveCount(1)
    await expect(emailError).toHaveText('Email is required')
    await emailInput.fill(emails.valid[0])
    await expect(emailError).toHaveCount(0)
  })

  test('should not login with incorrect credentials', async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.getByTestId('email')
    const passwordInput = page.getByTestId('password')
    const error = page.locator('#error')

    await emailInput.fill('wrong@xyz.com')
    await passwordInput.fill('wrongpassword')

    await page.click('button:has-text("Sign In")')

    await expect(page).toHaveURL('/login')
  })

  test('should register with valid password', async ({ page }) => {
    await page.goto('/register')

    const emailInput = page.getByTestId('email')
    const passwordInput = page.getByTestId('password')
    const cpasswordInput = page.getByTestId('cpassword')
    const firstNameInput = page.getByTestId('firstName')
    const lastNameInput = page.getByTestId('lastName')

    const emailError = page.getByTestId('email-error')
    const passwordError = page.getByTestId('password-error')
    const cpasswordError = page.getByTestId('cpassword-error')

    // Make sure no email error pops up
    await emailInput.fill(testemail)
    await passwordInput.fill(testpassword)
    await cpasswordInput.fill(testpassword)
    await firstNameInput.fill('Test')
    await lastNameInput.fill('User')
    await expect(emailError).toHaveCount(0)
    await expect(passwordError).toHaveCount(0)
    await expect(cpasswordError).toHaveCount(0)

    await page.click('button:has-text("Sign Up")')
    await expect(page).toHaveURL('/main')

    const logout = page.getByTestId('logout-button')
    await logout.click()
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Login', () => {
  test('should login with correct credentials', async ({ page }) => {
    // Logged in by default
    await logout(page)

    await page.goto('/login')

    const loginEmail = page.getByTestId('email')
    const loginPassword = page.getByTestId('password')

    await loginEmail.fill(testemail)
    await loginPassword.fill(testpassword)

    await page.click('button:has-text("Sign In")')

    await expect(page).toHaveURL('/main')
  })
})

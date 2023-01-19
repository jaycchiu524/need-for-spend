import { test, expect } from '@playwright/test'

// test('homepage has title and links to intro page', async ({ page }) => {
//   await page.goto('/')

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/)

//   // create a locator
//   const getStarted = page.getByRole('link', { name: 'Get started' })

//   // Expect an attribute "to be strictly equal" to the value.
//   await expect(getStarted).toHaveAttribute('href', '/docs/intro')

//   // Click the get started link.
//   await getStarted.click()

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/)
// })

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
})

test.describe('Login', () => {
  test('should login with correct credentials', async ({ page }) => {
    page.on('console', (msg) => console.log(msg.text()))

    const emailInput = page.getByTestId('email')
    const passwordInput = page.getByTestId('password')

    await emailInput.fill('abc@xyz.com')
    await passwordInput.fill('123456')

    await page.click('button:has-text("Sign In")')
    // TODO: Redirect to main page
    await expect(page).toHaveURL('/main')
  })

  // test('should not login with incorrect credentials', async ({ page }) => {
  //   const emailInput = page.getByTestId('email')
  //   const passwordInput = page.getByTestId('password')
  //   const error = page.locator('#error')

  //   await emailInput.fill('wrong@xyz.com')
  //   await passwordInput.fill('wrongpassword')

  //   await page.click('button:has-text("Sign In")')

  //   await expect(page).toHaveURL('/login')
  //   await expect(page).toContain('Invalid email or password')
  // })
})

// global-setup.ts
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/register')
  await page.getByTestId('email').fill(`test-${Date.now()}@example.com}`)
  await page.getByTestId('password').fill('12345678')
  await page.getByTestId('cpassword').fill('12345678')
  await page.getByTestId('firstName').fill('Test')
  await page.getByTestId('lastName').fill('User')
  await page.getByRole('button', { name: 'Sign Up' }).click()
  // Save signed-in state to 'storageState.json'.
  await page.context().storageState({ path: './tmp/storageState.json' })
  await browser.close()
}

export default globalSetup

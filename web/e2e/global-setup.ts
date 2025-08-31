import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Start MSW worker for API mocking
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  
  // Navigate to the app to initialize MSW
  await page.goto('http://localhost:3000')
  
  // Initialize MSW in the browser context
  await page.addInitScript(() => {
    // This will be injected into every page
    if (typeof window !== 'undefined') {
      // Set environment variable for tests
      window.__PLAYWRIGHT_TEST__ = true
    }
  })
  
  await browser.close()
}

export default globalSetup
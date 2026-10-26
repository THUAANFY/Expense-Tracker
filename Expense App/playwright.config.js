import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1440, height: 1080 },
    launchOptions:
      process.platform === 'win32'
        ? { executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' }
        : {},
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host localhost',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})

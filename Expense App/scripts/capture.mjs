import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

await mkdir('artifacts/screenshots', { recursive: true })
const browser = await chromium.launch(
  process.platform === 'win32'
    ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }
    : {},
)
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } })
await page.goto('http://localhost:5173')
await page.locator('#startup-screen').waitFor({ state: 'detached' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(600)
await page.screenshot({ path: 'artifacts/screenshots/design-desktop.png', fullPage: true })
await page.setViewportSize({ width: 390, height: 844 })
await page.waitForTimeout(450)
await page.screenshot({ path: 'artifacts/screenshots/design-mobile.png', fullPage: true })
await browser.close()

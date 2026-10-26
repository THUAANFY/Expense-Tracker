import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

await mkdir('test-results', { recursive: true })
const browser = await chromium.launch(
  process.platform === 'win32'
    ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }
    : {},
)
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } })
await page.goto('http://localhost:5173')
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(600)
await page.screenshot({ path: 'test-results/design-desktop.png', fullPage: true })
await page.setViewportSize({ width: 390, height: 844 })
await page.waitForTimeout(450)
await page.screenshot({ path: 'test-results/design-mobile.png', fullPage: true })
await browser.close()

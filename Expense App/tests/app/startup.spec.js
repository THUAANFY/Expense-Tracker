import { expect, test } from '@playwright/test'
import { createSampleData } from '../helpers/fixtures.js'

async function holdEntry(page) {
  let release
  const gate = new Promise((resolve) => {
    release = resolve
  })
  await page.route('**/src/main.jsx*', async (route) => {
    await gate
    await route.continue()
  })
  return release
}

const splash = (page) => page.getByRole('status', { name: 'Đang mở mây', exact: true })

test('logo appears before the slogan; a slow entry keeps the screen visible until the app is ready', async ({
  page,
}) => {
  const release = await holdEntry(page)
  await page.addInitScript(() => {
    window.startupAnimations = []
    document.addEventListener('animationstart', (event) => {
      if (event.target.matches('.startup-logo')) window.startupAnimations.push('logo')
      if (event.target.matches('.startup-slogan > span'))
        window.startupAnimations.push(event.target.textContent)
    })
  })
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(splash(page)).toBeVisible()
    await expect(page.locator('.startup-logo')).toHaveJSProperty('complete', true)
    await expect
      .poll(() =>
        page
          .locator('.startup-slogan > span')
          .last()
          .evaluate((e) => Number(getComputedStyle(e).opacity)),
      )
      .toBe(1)
    await expect(splash(page)).toBeVisible()
    expect(await page.locator('#root').evaluate((e) => e.inert)).toBeTruthy()
    await expect(page.locator('#root')).toHaveAttribute('aria-hidden', 'true')
    const order = await page.evaluate(() => window.startupAnimations)
    expect(order.indexOf('logo')).toBeGreaterThanOrEqual(0)
    expect(order.indexOf('Gọn chi tiêu,')).toBeGreaterThan(order.indexOf('logo'))
    expect(order.indexOf('nhẹ cuộc sống.')).toBeGreaterThan(order.indexOf('Gọn chi tiêu,'))
  } finally {
    release()
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  await expect(splash(page)).toHaveCount(0)
  expect(await page.locator('#root').evaluate((e) => e.inert)).toBeFalsy()
  await expect(page.locator('#root')).not.toHaveAttribute('aria-busy')
  await page.locator('.sidebar').getByRole('button', { name: 'Cài đặt', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Theo cách của bạn.')
  await expect(splash(page)).toHaveCount(0)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(splash(page)).toBeVisible()
  await expect(splash(page)).toHaveCount(0)
})

for (const [width, height] of [
  [320, 568],
  [1440, 900],
]) {
  test(`the startup composition fits a ${width}x${height} viewport and the app opens normally`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    const release = await holdEntry(page)
    try {
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await expect(splash(page)).toBeVisible()
      await expect(page.locator('#startup-screen')).toHaveAttribute('data-intro', 'true')
      const fits = await page.locator('.startup-content').evaluate((e) => {
        const r = e.getBoundingClientRect()
        return (
          r.left >= 0 &&
          r.right <= innerWidth &&
          r.top >= 0 &&
          r.bottom <= innerHeight &&
          document.documentElement.scrollWidth <= innerWidth
        )
      })
      expect(fits).toBeTruthy()
    } finally {
      release()
    }
    await expect(splash(page)).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
}

test('reduced motion shows the same branding without animation and unlocks the ready app', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const release = await holdEntry(page)
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#startup-screen')).toHaveAttribute('data-intro', 'true')
    const styles = await page
      .locator(
        '.startup-art, .startup-logo, .startup-wordmark, .startup-slogan > span, .startup-wait > span',
      )
      .evaluateAll((elements) =>
        elements.map((e) => ({
          animation: getComputedStyle(e).animationName,
          opacity: getComputedStyle(e).opacity,
        })),
      )
    expect(
      styles.every((value) => value.animation === 'none' && value.opacity === '1'),
    ).toBeTruthy()
  } finally {
    release()
  }
  await expect(splash(page)).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await page.locator('#root').evaluate((e) => e.inert)).toBeFalsy()
})

test('an unavailable logo keeps the wordmark and slogan and does not block startup', async ({
  page,
}) => {
  const release = await holdEntry(page)
  await page.route('**/logo-may.svg*', (route) => route.abort())
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#startup-screen')).toHaveAttribute('data-logo-error', 'true')
    await expect(page.locator('.startup-art')).toBeHidden()
    await expect(page.locator('.startup-wordmark')).toHaveText('mây.')
    await expect(page.locator('.startup-slogan')).toContainText('nhẹ cuộc sống.')
  } finally {
    release()
  }
  await expect(splash(page)).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('a render failure releases the loading screen and reload recovers the original book', async ({
  page,
}) => {
  const data = createSampleData()
  data.profile.name = 'An'
  const raw = JSON.stringify(data)
  await page.addInitScript((raw) => {
    if (!localStorage.getItem('may-expense-tracker-v1'))
      localStorage.setItem('may-expense-tracker-v1', raw)
  }, raw)
  await page.route('**/src/app/App.jsx*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'export default function App() { throw new Error("Simulated initial render failure") }',
    }),
  )
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('Chưa thể mở mây.')
  await expect(splash(page)).toHaveCount(0)
  expect(await page.locator('#root').evaluate((e) => e.inert)).toBeFalsy()
  expect(await page.evaluate(() => localStorage.getItem('may-expense-tracker-v1'))).toBe(raw)
  await page.unroute('**/src/app/App.jsx*')
  await page.getByRole('button', { name: 'Tải lại trang', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  await expect(page.locator('.greeting')).toContainText('Chào An')
  expect(await page.evaluate(() => localStorage.getItem('may-expense-tracker-v1'))).toBe(raw)
})

test('JavaScript disabled shows an explanation instead of an endless loading screen', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(baseURL)
  const explanation = page.locator('noscript .startup-failure p')
  await expect(explanation).toBeVisible()
  await expect(explanation).toHaveText('Bật JavaScript trong trình duyệt để mở mây.')
  await expect(page.locator('#startup-screen')).toBeHidden()
  await context.close()
})

test('startup and budget popup no longer depend on the stale Dialogs module', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('**/src/components/Dialogs.jsx*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'export {}',
    }),
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  await page
    .locator('.sidebar')
    .getByRole('button', { name: 'Danh mục & ngân sách', exact: true })
    .click()
  await page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('spinbutton')).toHaveValue('3000000')
  expect(errors).toEqual([])
})

test('a failed entry import offers reload and recovers without clearing stored records', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  const data = createSampleData()
  data.profile.name = 'An'
  await page.evaluate(
    (value) => localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value)),
    data,
  )
  await page.route('**/src/features/budgets/dialogs/BudgetDialog.jsx*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'export {}',
    }),
  )
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Chưa thể mở mây.')
  await expect(page.getByRole('button', { name: 'Tải lại trang', exact: true })).toBeVisible()
  await page.unroute('**/src/features/budgets/dialogs/BudgetDialog.jsx*')
  await page.getByRole('button', { name: 'Tải lại trang', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  await expect(page.locator('.greeting')).toContainText('Chào An')
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('may-expense-tracker-v1')).transactions.length,
    ),
  ).toBe(data.transactions.length)
})

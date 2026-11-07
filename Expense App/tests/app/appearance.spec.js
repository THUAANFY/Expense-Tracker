import { expect, test } from '@playwright/test'
import { createEmptyData, monthKey, STORAGE_KEY } from '../../src/shared/storage/data.js'
import {
  APPEARANCE_KEY,
  parseAppearance,
  resolveAppearance,
} from '../../src/app/theme/appearance.js'
import { selectMonth } from '../helpers/month-picker.js'

function book() {
  const data = createEmptyData()
  data.monthlyBudgets = { [monthKey()]: 5000000 }
  data.moneySources = [
    {
      id: 'cash',
      name: 'Ví của tôi',
      type: 'cash',
      color: 'mint',
      openingBalance: 10000000,
      openingDate: `${monthKey()}-01`,
      createdAt: Date.now(),
    },
  ]
  return data
}
const radio = (page, name) => page.getByRole('radio', { name, exact: true })
async function prepare(page, mode = 'light') {
  await page.addInitScript(
    ({ book, key, appearanceKey, mode }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(book))
      if (!localStorage.getItem(appearanceKey))
        localStorage.setItem(appearanceKey, JSON.stringify({ version: 1, mode }))
    },
    { book: book(), key: STORAGE_KEY, appearanceKey: APPEARANCE_KEY, mode },
  )
}
async function ready(page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
async function settings(page) {
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name: 'Cài đặt', exact: true }).click()
  await expect(
    page.getByRole('radiogroup', { name: 'Chế độ giao diện', exact: true }),
  ).toBeVisible()
}
const rawBook = (page) => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)

test('appearance data validates independently from the financial book', () => {
  for (const mode of ['light', 'dark', 'system'])
    expect(parseAppearance(JSON.stringify({ version: 1, mode }))).toBe(mode)
  for (const raw of [
    null,
    '',
    '{broken',
    '"dark"',
    '{}',
    '{"version":2,"mode":"dark"}',
    '{"version":1,"mode":"unknown"}',
  ])
    expect(parseAppearance(raw)).toBe('light')
  expect(resolveAppearance('system', true)).toBe('dark')
  expect(resolveAppearance('system', false)).toBe('light')
  expect(resolveAppearance('light', true)).toBe('light')
  expect(resolveAppearance('dark', false)).toBe('dark')
})

test('settings switches immediately, preserves drafts and finances, and remembers the choice on reload', async ({
  page,
}) => {
  await prepare(page)
  await ready(page)
  await settings(page)
  const before = await rawBook(page)
  await page
    .getByRole('textbox', { name: 'Mây có thể gọi bạn là', exact: true })
    .fill('Một tên chưa lưu')
  await page
    .getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng (VND)', exact: true })
    .fill('6000000')
  await radio(page, 'Tối').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(13, 17, 29)')
  await expect(radio(page, 'Tối')).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('.settings-category-mark')).toHaveCount(8)
  await expect(
    page.getByRole('textbox', { name: 'Mây có thể gọi bạn là', exact: true }),
  ).toHaveValue('Một tên chưa lưu')
  await expect(
    page.getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng (VND)', exact: true }),
  ).toHaveValue('6000000')
  expect(await rawBook(page)).toBe(before)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await settings(page)
  await expect(radio(page, 'Tối')).toHaveAttribute('aria-checked', 'true')
  await radio(page, 'Sáng').click()
  await expect(page.locator('.settings-category-mark')).toHaveCount(0)
  await expect(page.locator('.settings-ratio-row > .category-art')).toHaveCount(8)
  expect(await rawBook(page)).toBe(before)
})

test('keyboard selection follows the system, while explicit choices synchronize across tabs', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await prepare(page)
  await ready(page)
  await settings(page)
  await radio(page, 'Sáng').focus()
  await page.keyboard.press('ArrowRight')
  await expect(radio(page, 'Tối')).toBeFocused()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.keyboard.press('ArrowRight')
  await expect(radio(page, 'Theo thiết bị')).toBeFocused()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const other = await context.newPage()
  await ready(other)
  await settings(other)
  await radio(other, 'Sáng').click()
  await expect(radio(page, 'Sáng')).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('the remembered dark palette is present on the loading screen before React arrives', async ({
  page,
}) => {
  await prepare(page, 'dark')
  let release
  const gate = new Promise((resolve) => {
    release = resolve
  })
  await page.route('**/src/main.jsx*', async (route) => {
    await gate
    await route.continue()
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.startup-screen')).toBeVisible()
  expect(
    await page.locator('.startup-screen').evaluate((el) => getComputedStyle(el).backgroundImage),
  ).toContain('13, 17, 29')
  release()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('a failed preference write still changes the current theme and leaves financial bytes untouched', async ({
  page,
}) => {
  await prepare(page)
  await ready(page)
  await settings(page)
  const before = await rawBook(page)
  await page.evaluate((key) => {
    const write = Storage.prototype.setItem
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Full', 'QuotaExceededError')
      return write.call(this, name, value)
    }
  }, APPEARANCE_KEY)
  await radio(page, 'Tối').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.appearance-notice')).toContainText(
    'Trình duyệt chưa lưu được lựa chọn',
  )
  expect(await rawBook(page)).toBe(before)
})

test('appearance stays editable while viewing a closed budget month', async ({ page }) => {
  await prepare(page)
  await ready(page)
  await settings(page)
  const now = new Date(),
    previous = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
  await selectMonth(page, previous, 'Chọn tháng ngân sách')
  await expect(
    page.getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng (VND)', exact: true }),
  ).toHaveAttribute('readonly', '')
  const before = await rawBook(page)
  await radio(page, 'Tối').click()
  await expect(radio(page, 'Tối')).toHaveAttribute('aria-checked', 'true')
  expect(await rawBook(page)).toBe(before)
})

for (const width of [320, 1440])
  test(`dark settings and its popups stay usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 320 ? 740 : 1000 })
    await prepare(page, 'dark')
    await ready(page)
    await settings(page)
    await expect(radio(page, 'Tối')).toHaveAttribute('aria-checked', 'true')
    await page.getByRole('button', { name: 'Chọn tháng ngân sách', exact: true }).click()
    const monthPicker = page.getByRole('dialog', { name: 'CHỌN THÁNG & NĂM', exact: true })
    await expect(monthPicker).toHaveCSS('background-color', 'rgb(28, 35, 53)')
    await page.keyboard.press('Escape')
    await page.locator('input[type=file]').setInputFiles({
      name: 'theme-preview.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(book())),
    })
    const dialog = page.getByRole('dialog', { name: 'Khôi phục bản sao lưu?', exact: true })
    await expect(dialog).toHaveCSS('background-color', 'rgb(28, 35, 53)')
    await dialog.getByRole('button', { name: 'Hủy', exact: true }).click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })

import { expect, test } from '@playwright/test'
import { createEmptyData, dateKey, monthKey, money, STORAGE_KEY } from '../src/data.js'
import { selectMonth } from './helpers/month-picker.js'

const month = monthKey()
const now = new Date()
const previous = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
const tx = (id, amount, overrides = {}) => ({
  id,
  title: id,
  amount,
  type: 'expense',
  category: 'food',
  date: dateKey(),
  createdAt: Date.now(),
  wallet: 'Tiền mặt',
  note: '',
  ...overrides,
})
const corner = (page) => page.getByRole('region', { name: 'Góc mây ghi chép', exact: true })
async function seed(page, transactions = []) {
  const data = { ...createEmptyData(), transactions }
  await page.addInitScript(
    ({ key, data }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, data },
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  return page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
}

test('the largest expense follows the selected month, ignores income and opens the actual record', async ({
  page,
}) => {
  const raw = await seed(page, [
    tx('Khoản thu lớn', 1e12, { type: 'income' }),
    tx('Khoản nhỏ', 25000),
    tx('Cùng số tiền nhưng cũ hơn', 1200000, { createdAt: 0 }),
    tx('Bàn làm việc', 1200000, { category: 'home', createdAt: Date.now() + 1 }),
    tx('Khoản tháng trước', 1e12, { date: `${previous}-05` }),
  ])
  await expect(corner(page)).toContainText('Bàn làm việc')
  await expect(corner(page)).toContainText(money(1200000))
  await expect(corner(page)).not.toContainText('Khoản thu lớn')
  await corner(page)
    .getByRole('button', { name: 'Xem khoản chi lớn nhất: Bàn làm việc', exact: true })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toHaveValue(
    'Bàn làm việc',
  )
  await expect(dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true })).toHaveValue(
    '1200000',
  )
  await dialog.getByRole('button', { name: 'Để sau', exact: true }).click()
  await selectMonth(page, previous)
  await expect(corner(page)).toContainText('Khoản tháng trước')
  await corner(page).getByRole('button').click()
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Đóng chi tiết', exact: true }).click()
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(raw)
})

test('an income-only month invites its first expense and updates the receipt after saving', async ({
  page,
}) => {
  await seed(page, [tx('Khoản thu', 1000000, { type: 'income' })])
  await expect(corner(page)).toContainText('Chưa có khoản chi trong tháng này')
  await corner(page).getByRole('button', { name: 'Ghi một khoản chi', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true }).fill('Một bữa trưa nhỏ')
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('50000')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(corner(page)).toContainText('Một bữa trưa nhỏ')
  await expect(corner(page)).toContainText(money(50000))
  await selectMonth(page, previous)
  await expect(corner(page)).toContainText('Chưa có khoản chi trong tháng này')
  await expect(corner(page).getByRole('button')).toHaveCount(0)
})

test('the scene pauses outside the viewport or on a hidden tab and respects reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 700 })
  await seed(page, [tx('Bữa trưa', 50000)])
  await corner(page).scrollIntoViewIfNeeded()
  await expect(corner(page)).toHaveAttribute('data-animate', 'true')
  await expect(corner(page).locator('.journal-cloud')).toHaveCSS('animation-play-state', 'running')
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(corner(page)).toHaveAttribute('data-animate', 'false')
  await expect(corner(page).locator('.journal-cloud')).toHaveCSS('animation-play-state', 'paused')
  await page.evaluate(() => {
    delete document.visibilityState
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(corner(page)).toHaveAttribute('data-animate', 'true')
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(corner(page)).toHaveAttribute('data-animate', 'false')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await corner(page).scrollIntoViewIfNeeded()
  await expect(corner(page).locator('.journal-cloud')).toHaveCSS('animation-name', 'none')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(corner(page)).not.toBeVisible()
  await expect(page.locator('.overview-journal-corner')).toHaveAttribute('data-animate', 'false')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
})

test('long titles and large amounts fit the narrow desktop column', async ({ page }) => {
  await page.setViewportSize({ width: 1051, height: 900 })
  const title = 'Khoản chi cho một câu chuyện nhỏ của mình '.repeat(2).trim()
  await seed(page, [tx(title, 1e12)])
  await expect(corner(page)).toContainText(title)
  await expect(corner(page)).toContainText(money(1e12))
  await corner(page).getByRole('button').focus()
  await expect(corner(page).getByRole('button')).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1051)
})

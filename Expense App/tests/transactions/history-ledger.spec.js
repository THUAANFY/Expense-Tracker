import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import {
  createEmptyData,
  formatDate,
  isValidData,
  money,
  monthKey,
  STORAGE_KEY,
} from '../../src/shared/storage/data.js'
import { chooseHistoryFilter } from '../helpers/history-filters.js'
import { selectMonth } from '../helpers/month-picker.js'

const current = monthKey()
const now = new Date()
const previous = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))

async function openLedger(page) {
  const data = createEmptyData()
  data.moneySources = [
    {
      id: 'cash',
      name: 'Ví hằng ngày',
      type: 'cash',
      color: 'mint',
      openingDate: `${previous}-01`,
      openingBalance: 5000000,
      createdAt: 1,
    },
  ]
  data.transactions = Array.from({ length: 10 }, (_, i) => ({
    id: `entry-${i}`,
    title: `Giao dịch ${i}`,
    amount: 12000 + i,
    category: i % 2 ? 'food' : 'shopping',
    type: i === 9 ? 'income' : 'expense',
    date: `${current}-${String(i + 1).padStart(2, '0')}`,
    sourceId: 'cash',
    wallet: 'Tiền mặt',
    note: 'Nội dung đầy đủ để sao chép',
    createdAt: i + 1,
  }))
  data.transactions.push({
    ...data.transactions[0],
    id: 'past-entry',
    title: 'Giao dịch tháng trước',
    date: `${previous}-05`,
  })
  expect(isValidData(data)).toBeTruthy()
  await page.addInitScript(
    ({ data, key }) => {
      localStorage.setItem(key, JSON.stringify(data))
      localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode: 'dark' }))
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.__copiedTransaction = text
          },
        },
      })
    },
    { data, key: STORAGE_KEY },
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page
    .locator('.sidebar')
    .getByRole('button', { name: 'Lịch sử giao dịch', exact: true })
    .click()
  await expect(page.locator('.history-transaction-row')).toHaveCount(8)
  return data
}
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)

test('dark ledger menu copies the actual record, restores keyboard focus and handles clipboard errors without changing the book', async ({
  page,
}) => {
  const data = await openLedger(page)
  const item = data.transactions.find((item) => item.id === 'entry-9')
  const trigger = page.getByRole('button', {
    name: `Thao tác giao dịch ${item.title}`,
    exact: true,
  })
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('menuitem', { name: 'Sửa giao dịch', exact: true })).toBeFocused()
  await page.keyboard.press('End')
  await expect(page.getByRole('menuitem', { name: 'Sao chép nội dung', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', { name: 'Đã sao chép', exact: true })).toBeVisible()
  const copied = await page.evaluate(() => window.__copiedTransaction)
  expect(copied).toContain(`+${money(item.amount)} · Thu nhập`)
  expect(copied).toContain(`Ngày: ${formatDate(item.date)}`)
  expect(copied).toContain('Nguồn tiền: Ví hằng ngày')
  expect(copied).toContain(`Ghi chú: ${item.note}`)
  await expect(page.locator('dialog[open]')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('Clipboard unavailable')
    }
  })
  await page.getByRole('menuitem', { name: 'Sao chép nội dung', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Chưa sao chép được')
  await page.keyboard.press('Escape')
  expect(await stored(page)).toEqual(data)
})

test('past-month actions only open read-only details', async ({ page }) => {
  const data = await openLedger(page)
  await selectMonth(page, previous)
  await page
    .getByRole('button', { name: 'Thao tác giao dịch Giao dịch tháng trước', exact: true })
    .click()
  await expect(page.getByRole('menuitem', { name: 'Sửa giao dịch', exact: true })).toHaveCount(0)
  await page.getByRole('menuitem', { name: 'Xem chi tiết', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Chi tiết giao dịch', exact: true })
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toBeDisabled()
  await expect(dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true })).toBeDisabled()
  await expect(dialog.getByRole('button', { name: 'Xóa giao dịch', exact: true })).toHaveCount(0)
  await expect(dialog.locator('button[type="submit"]')).toHaveCount(0)
  expect(await stored(page)).toEqual(data)
})

test('dark history filters, ranking, pagination, local search shortcut and CSV use the same results', async ({
  page,
}) => {
  const data = await openLedger(page)
  await page.getByRole('button', { name: 'Trang sau', exact: true }).click()
  await expect(page.locator('.history-transaction-row')).toHaveCount(2)
  await page.getByRole('button', { name: 'Trang trước', exact: true }).click()
  await chooseHistoryFilter(page, 'Lọc danh mục', 'Ăn uống')
  await expect(page.locator('.history-transaction-row')).toHaveCount(4)
  await expect(page.locator('.history-transaction-row[data-type="income"]')).toHaveCount(0)
  await chooseHistoryFilter(page, 'Sắp xếp giao dịch', 'Số tiền cao nhất')
  await expect(page.locator('.history-transaction-row').first()).toContainText('Giao dịch 7')
  await expect(page.locator('.history-row-date')).toHaveCount(4)
  await page.keyboard.press('Control+k')
  const search = page.getByRole('textbox', { name: 'Tìm trong lịch sử giao dịch', exact: true })
  await expect(search).toBeFocused()
  await search.fill('Giao dịch 7')
  await expect(page.locator('.history-transaction-row')).toHaveCount(1)
  const downloading = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất CSV', exact: true }).click()
  const download = await downloading
  const csv = await readFile(await download.path(), 'utf8')
  expect(csv).toContain('Giao dịch 7')
  expect(csv).not.toContain('Giao dịch 9')
  await page.getByRole('button', { name: 'Xóa bộ lọc', exact: true }).click()
  await expect(page.locator('.history-transaction-row')).toHaveCount(8)
  expect(await stored(page)).toEqual(data)
})

test('touch ledger keeps its action menu and filter popups inside a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await openLedger(page)
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBeTruthy()
  await page.getByRole('combobox', { name: 'Lọc danh mục', exact: true }).click()
  const filters = await page
    .getByRole('listbox', { name: 'Lọc danh mục', exact: true })
    .boundingBox()
  expect(filters.x).toBeGreaterThanOrEqual(16)
  expect(filters.x + filters.width).toBeLessThanOrEqual(304)
  await page.keyboard.press('Escape')
  const more = page.locator('.history-row-more').first()
  await more.click()
  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  const box = await menu.boundingBox()
  expect(box.x).toBeGreaterThanOrEqual(16)
  expect(box.x + box.width).toBeLessThanOrEqual(304)
  await page.keyboard.press('Escape')
  await more.click()
  await page.getByRole('menuitem', { name: 'Sửa giao dịch', exact: true }).click()
  await expect(
    page.getByRole('dialog', { name: 'Một giao dịch, một câu chuyện', exact: true }),
  ).toBeVisible()
})

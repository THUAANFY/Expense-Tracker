import { expect, test } from '@playwright/test'
import {
  createEmptyData,
  dateKey,
  formatDate,
  isValidData,
  monthKey,
  money,
  STORAGE_KEY,
} from '../../src/shared/storage/data.js'
import { selectMonth } from '../helpers/month-picker.js'

function book() {
  const data = createEmptyData()
  data.moneySources = [
    {
      id: 'cash',
      name: 'Tiền mặt',
      type: 'cash',
      color: 'mint',
      openingBalance: 2000000,
      openingDate: `${monthKey()}-01`,
      createdAt: 1,
    },
  ]
  data.transactions = [
    ['transport', 'đồ ăn', 'transport', 130000, 'expense'],
    ['income', 'Khoản thu', 'other', 12000, 'income'],
    ['health', 'Thuốc và vitamin', 'health', 1000000, 'expense'],
    ['fun', 'Cà phê sáng', 'fun', 800010, 'expense'],
    ['food', 'Bữa sáng', 'food', 1000, 'expense'],
    ...Array.from({ length: 5 }, (_, index) => [
      `old-${index}`,
      `Giao dịch ${index}`,
      'other',
      10000,
      'expense',
    ]),
  ].map(([id, title, category, amount, type], index) => ({
    id,
    title,
    category,
    amount,
    type,
    date: dateKey(),
    wallet: 'Tiền mặt',
    note: index === 2 ? 'Theo hướng dẫn bác sĩ' : '',
    sourceId: index < 2 ? 'cash' : undefined,
    createdAt: 100 - index,
  }))
  return data
}
async function open(page, data = book()) {
  expect(isValidData(data)).toBe(true)
  await page.addInitScript(
    ({ data, key }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data))
      localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode: 'dark' }))
    },
    { data, key: STORAGE_KEY },
  )
  await page.goto('/')
  await expect(page.locator('.fintech-recent-panel')).toBeVisible()
}
const row = (page, id) => page.locator(`.recent-panel [data-transaction-id="${id}"]`)

test('dark recent rows show the five newest records, signed amounts, weekday and even borders', async ({
  page,
}) => {
  await open(page)
  const panel = page.locator('.recent-panel')
  await expect(panel.locator('.transaction-row')).toHaveCount(5)
  await expect(panel.locator('.count-badge')).toHaveText('10')
  await expect(row(page, 'transport').locator('.transaction-amount')).toHaveText(
    `−${money(130000)}`,
  )
  await expect(row(page, 'income').locator('.transaction-amount')).toHaveText(`+${money(12000)}`)
  await expect(row(page, 'health')).toContainText('Chưa gán nguồn')
  await expect(row(page, 'health')).toContainText('Theo hướng dẫn bác sĩ')
  await expect(row(page, 'transport').locator('time')).toHaveText(formatDate(dateKey()))
  await expect(row(page, 'transport').locator('.recent-transaction-date small')).toHaveText(
    formatDate(dateKey(), { weekday: 'long' }),
  )
  const borders = await panel.locator('.transaction-row').evaluateAll((nodes) =>
    nodes.map((el) => {
      const style = getComputedStyle(el)
      return [
        style.borderLeftWidth,
        style.borderRightWidth,
        getComputedStyle(el, '::before').display,
      ]
    }),
  )
  expect(
    borders.every(
      ([left, right, before]) => left === '1px' && right === '1px' && before === 'none',
    ),
  ).toBe(true)
})

test('the recent menu supports keyboard dismissal, editing and locating the exact history record', async ({
  page,
}) => {
  await open(page)
  const before = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
  const actions = row(page, 'transport').getByRole('button', { name: 'Thao tác giao dịch đồ ăn' })
  await actions.press('ArrowDown')
  const menu = page.getByRole('menu', { name: 'Thao tác giao dịch đồ ăn' })
  await expect(menu.getByRole('menuitem', { name: 'Sửa giao dịch' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).not.toBeVisible()
  await expect(actions).toBeFocused()
  await actions.click()
  await menu.getByRole('menuitem', { name: 'Sửa giao dịch' }).click()
  const dialog = page.locator('.transaction-dialog')
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toHaveValue(
    'đồ ăn',
  )
  await dialog.getByRole('button', { name: 'Để sau', exact: true }).click()
  await actions.click()
  await menu.getByRole('menuitem', { name: 'Xem trong lịch sử' }).click()
  await expect(page.locator('.history-ledger [data-transaction-id="transport"]')).toHaveAttribute(
    'data-highlighted',
    'true',
  )
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before)
})

test('recent transactions from a closed month offer viewing and keep the editor read-only', async ({
  page,
}) => {
  const data = book()
  const now = new Date(),
    previous = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
  data.transactions[0].date = `${previous}-15`
  await open(page, data)
  await selectMonth(page, previous)
  await row(page, 'transport').getByRole('button', { name: 'Thao tác giao dịch đồ ăn' }).click()
  const menu = page.getByRole('menu', { name: 'Thao tác giao dịch đồ ăn' })
  await expect(menu.getByRole('menuitem', { name: 'Sửa giao dịch' })).toHaveCount(0)
  await menu.getByRole('menuitem', { name: 'Xem giao dịch' }).click()
  await expect(page.locator('.transaction-dialog')).toBeVisible()
  await expect(
    page.locator('.transaction-dialog').getByRole('button', { name: /^Lưu (giao dịch|thay đổi)$/ }),
  ).toHaveCount(0)
})

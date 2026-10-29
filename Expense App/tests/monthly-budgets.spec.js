import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createEmptyData, dateKey, isValidData, money, monthKey, STORAGE_KEY } from '../src/data.js'
import { budgetFunds, getMonthlyBudget, monthlyBudgetFundingError } from '../src/monthlyBudgets.js'
import { buildNotifications } from '../src/notifications.js'
import { selectMonth } from './helpers/month-picker.js'

const month = monthKey()
const now = new Date()
const nextMonth = monthKey(new Date(now.getFullYear(), now.getMonth() + 1, 1))
const previousMonth = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
function book(balance = 5000000) {
  const data = createEmptyData()
  data.profile.budget = 4000000
  data.moneySources = [
    {
      id: 'cash',
      name: 'Ví của tôi',
      type: 'cash',
      color: 'mint',
      openingBalance: balance,
      openingDate: `${month}-01`,
      createdAt: Date.now(),
    },
  ]
  return data
}
const transaction = (id, amount, overrides = {}) => ({
  id,
  amount,
  title: id,
  type: 'expense',
  category: 'food',
  date: dateKey(),
  sourceId: 'cash',
  note: '',
  wallet: 'Tiền mặt',
  createdAt: Date.now(),
  ...overrides,
})
async function seed(page, data = book()) {
  await page.addInitScript(
    ({ key, data }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, data },
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
async function navigate(page, name = 'Cài đặt') {
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name, exact: true }).click()
}
const input = (page) =>
  page.getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng', exact: false })
const save = (page) => page.getByRole('button', { name: 'Lưu thay đổi', exact: true })
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)
const chooseMonth = (page, value) => selectMonth(page, value, 'Chọn tháng ngân sách')

test('monthly budgets validate independently and legacy amounts remain unchanged', () => {
  const data = book()
  expect(getMonthlyBudget(data, previousMonth)).toBe(4000000)
  data.monthlyBudgets = { [month]: 3000000, [nextMonth]: 5000000 }
  expect(getMonthlyBudget(data, month)).toBe(3000000)
  expect(getMonthlyBudget(data, nextMonth)).toBe(5000000)
  expect(getMonthlyBudget(data, previousMonth)).toBe(4000000)
  expect(isValidData(data)).toBeTruthy()
  for (const value of [
    null,
    [],
    { '2026-13': 1 },
    { '1899-12': 1 },
    { [month]: 0 },
    { [month]: -1 },
    { [month]: 1.5 },
    { [month]: 1e12 + 1 },
  ]) {
    expect(isValidData({ ...data, monthlyBudgets: value })).toBeFalsy()
  }
})

test('funding uses tracked balances today, excludes unassigned and future income, and accepts the exact maximum', () => {
  const data = book()
  data.transactions = [
    transaction('spent', 1000000),
    transaction('future', 9000000, { date: '2099-01-01', type: 'income' }),
    transaction('unassigned', 50000000, { sourceId: undefined, type: 'income' }),
    transaction('before', 9000000, { date: '1970-01-01', type: 'income' }),
  ]
  expect(budgetFunds(data).available).toBe(4000000)
  expect(monthlyBudgetFundingError(data, 4000000)).toBe('')
  expect(monthlyBudgetFundingError(data, 4000001)).toContain('vượt số tiền hiện có')
  expect(monthlyBudgetFundingError(createEmptyData(), 1000000)).toContain('chưa có nguồn tiền')
  data.transactions.push(transaction('overdrawn', 5000000))
  expect(budgetFunds(data).available).toBe(0)
  expect(monthlyBudgetFundingError(data, 1)).toContain('Mức tối đa hiện tại là 0 ₫')
})

test('notifications use the current month plan instead of the legacy or future budget', () => {
  const data = book()
  data.profile.budget = 10000000
  data.monthlyBudgets = { [month]: 1000000, [nextMonth]: 9000000 }
  data.transactions = [transaction('budget-spending', 850000)]
  const notices = buildNotifications(data, { remindersEnabled: false })
  const notice = notices.find((item) => item.title.startsWith('Ngân sách tháng'))
  expect(notice.title).toContain('sắp chạm ngân sách')
  expect(notice.description).toContain(money(150000))
})

test('an overfunded input cannot save; an exact funded plan persists only for its selected month', async ({
  page,
}) => {
  await seed(page)
  await navigate(page)
  const before = await stored(page)
  await input(page).fill('6000000')
  await expect(input(page)).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('.settings-budget-error')).toContainText('1.000.000 ₫')
  await expect(save(page)).toBeDisabled()
  await input(page).press('Enter')
  expect(await stored(page)).toEqual(before)
  await input(page).fill('5000000')
  await expect(save(page)).toBeEnabled()
  await save(page).click()
  await expect.poll(async () => (await stored(page)).monthlyBudgets?.[month]).toBe(5000000)
  const saved = await stored(page)
  expect(saved.profile.budget).toBe(4000000)
  expect(getMonthlyBudget(saved, previousMonth)).toBe(4000000)
  expect(saved.transactions).toEqual([])
  await page.reload()
  await navigate(page)
  await expect(input(page)).toHaveValue('5000000')
  const downloading = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất bản sao lưu', exact: true }).click()
  const backup = JSON.parse(await readFile(await (await downloading).path(), 'utf8'))
  expect(backup.monthlyBudgets[month]).toBe(5000000)
})

test('additional income permits a higher next month budget without altering this month', async ({
  page,
}) => {
  const data = book()
  data.monthlyBudgets = { [month]: 4000000 }
  await seed(page, data)
  await navigate(page)
  await chooseMonth(page, nextMonth)
  await input(page).fill('8000000')
  await expect(save(page)).toBeDisabled()
  await navigate(page, 'Nguồn tiền')
  await page.getByRole('button', { name: 'Ghi khoản thu vào Ví của tôi', exact: true }).click()
  const dialog = page.locator('.transaction-dialog')
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('4000000')
  await dialog
    .getByRole('textbox', { name: 'Tên giao dịch', exact: true })
    .fill('Khoản thu bổ sung')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await navigate(page)
  await chooseMonth(page, nextMonth)
  await input(page).fill('8000000')
  await expect(save(page)).toBeEnabled()
  await save(page).click()
  await expect.poll(async () => (await stored(page)).monthlyBudgets?.[nextMonth]).toBe(8000000)
  expect((await stored(page)).monthlyBudgets[month]).toBe(4000000)
  await navigate(page, 'Danh mục & ngân sách')
  await expect(page.locator('.category-overview-usage > span').last()).toContainText(money(8000000))
  await selectMonth(page, month)
  await expect(page.locator('.category-overview-usage > span').last()).toContainText(money(4000000))
})

test('name-only edits remain possible without sources, while new budgets require funds', async ({
  page,
}) => {
  await seed(page, { ...book(), moneySources: [] })
  await navigate(page)
  await expect(page.locator('.settings-budget-error')).toContainText('chưa có nguồn tiền')
  await page.getByRole('textbox', { name: 'Mây có thể gọi bạn là', exact: true }).fill('Tên mới')
  await expect(save(page)).toBeEnabled()
  await save(page).click()
  await expect.poll(async () => (await stored(page)).profile.name).toBe('Tên mới')
  expect((await stored(page)).monthlyBudgets).toBeUndefined()
  await input(page).fill('1000000')
  await expect(save(page)).toBeDisabled()
  expect((await stored(page)).profile.budget).toBe(4000000)
})

test('a concurrent withdrawal blocks a stale budget write and retains the draft', async ({
  page,
  context,
}) => {
  const data = book(9000000)
  data.monthlyBudgets = { [month]: 4000000 }
  await seed(page, data)
  await navigate(page)
  await input(page).fill('6000000')
  const other = await context.newPage()
  await other.goto('/')
  await other.evaluate(
    async ({ key, expense }) => {
      const { persistBook } = await import('/src/bookStorage.js')
      const raw = localStorage.getItem(key),
        base = JSON.parse(raw)
      await persistBook(base, { ...base, transactions: [expense] }, { baseRaw: raw })
    },
    { key: STORAGE_KEY, expense: transaction('other-tab-expense', 4000000) },
  )
  await expect(page.locator('.settings-budget-error')).toContainText(
    'Mức tối đa hiện tại là 5.000.000 ₫',
  )
  await expect(input(page)).toHaveValue('6000000')
  await expect(save(page)).toBeDisabled()
  const before = await stored(page)
  const error = await page.evaluate(
    async ({ base, month }) => {
      const { persistBook } = await import('/src/bookStorage.js')
      try {
        await persistBook(
          base,
          { ...base, monthlyBudgets: { [month]: 6000000 } },
          { baseRaw: JSON.stringify(base) },
        )
        return ''
      } catch (error) {
        return error.code
      }
    },
    { base: data, month },
  )
  expect(error).toBe('budget-funds')
  expect(await stored(page)).toEqual(before)
})

test('two month drafts survive switching and concurrent month plans merge while same-month conflicts do not overwrite', async ({
  page,
  context,
}) => {
  await seed(page)
  await navigate(page)
  await input(page).fill('3000000')
  await chooseMonth(page, nextMonth)
  await input(page).fill('2000000')
  await chooseMonth(page, month)
  await expect(input(page)).toHaveValue('3000000')
  const other = await context.newPage()
  await other.goto('/')
  await navigate(other)
  await chooseMonth(other, nextMonth)
  await input(other).fill('2500000')
  await Promise.all([save(page).click(), save(other).click()])
  await expect
    .poll(async () => (await stored(page)).monthlyBudgets)
    .toEqual({ [month]: 3000000, [nextMonth]: 2500000 })
  await chooseMonth(page, nextMonth)
  await expect(input(page)).toHaveValue('2000000')
  await save(page).click()
  await expect(page.locator('.storage-alert')).toContainText('tab khác')
  expect((await stored(page)).monthlyBudgets[nextMonth]).toBe(2500000)
  await expect(input(page)).toHaveValue('2000000')
})

test('restoring saved monthly plans preserves historical amounts even after money has been spent', async ({
  page,
}) => {
  const original = book()
  original.monthlyBudgets = { [previousMonth]: 15000000 }
  await seed(page, original)
  await navigate(page)
  const backup = book(2000000)
  backup.monthlyBudgets = { [month]: 10000000, [previousMonth]: 15000000 }
  await page.locator('input[type="file"]').setInputFiles({
    name: 'monthly-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  })
  const dialog = page.getByRole('dialog', { name: 'Khôi phục bản sao lưu?', exact: true })
  await expect(dialog).toContainText(money(10000000))
  await dialog.getByRole('button', { name: 'Khôi phục dữ liệu', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  expect((await stored(page)).monthlyBudgets).toEqual(backup.monthlyBudgets)
  await expect(input(page)).toHaveValue('10000000')
})

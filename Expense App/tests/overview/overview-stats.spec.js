import { expect, test } from '@playwright/test'
import { createEmptyData, dateKey, money, STORAGE_KEY } from '../../src/shared/storage/data.js'

async function openStats(page, { previousIncome = 0, previousExpense = 0 } = {}) {
  const now = new Date()
  const previousDate = dateKey(new Date(now.getFullYear(), now.getMonth() - 1, 15))
  const data = createEmptyData()
  const transaction = (id, amount, type, date) => ({
    id,
    amount,
    type,
    date,
    category: 'other',
    title: id,
    wallet: 'Tiền mặt',
    note: '',
    createdAt: 1,
  })
  data.transactions = [
    transaction('current-income', 5000000, 'income', dateKey()),
    transaction('current-expense', 1000000, 'expense', dateKey()),
    ...(previousIncome
      ? [transaction('previous-income', previousIncome, 'income', previousDate)]
      : []),
    ...(previousExpense
      ? [transaction('previous-expense', previousExpense, 'expense', previousDate)]
      : []),
  ]
  await page.addInitScript(
    ({ data, key }) => {
      localStorage.setItem(key, JSON.stringify(data))
      localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode: 'dark' }))
    },
    { data, key: STORAGE_KEY },
  )
  await page.goto('/')
  await expect(page.locator('.overview-workspace .stats-grid')).toBeVisible()
}

test('overview comparisons use the preceding month and hiding the balance also hides its percentage', async ({
  page,
}) => {
  await openStats(page, { previousIncome: 4000000, previousExpense: 2000000 })
  const income = page.locator('.overview-income-card')
  const expense = page.locator('.overview-expense-card')
  const balance = page.locator('.balance-card')
  await expect(income.locator('.stat-value')).toHaveText(money(5000000))
  await expect(expense.locator('.stat-value')).toHaveText(money(1000000))
  await expect(balance.locator('.stat-value')).toHaveText(money(4000000))
  await expect(income.locator('.stat-foot .pill')).toHaveText('25,0%')
  await expect(expense.locator('.stat-foot .pill')).toHaveText('50,0%')
  await expect(balance.locator('.stat-foot .pill')).toHaveText('100,0%')
  await expect(balance.locator('.stat-foot')).toContainText('So với tháng trước')
  const before = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
  await balance.getByRole('button', { name: 'Ẩn số dư', exact: true }).click()
  await expect(balance.locator('.stat-value')).toHaveText('••••••••')
  await expect(balance.locator('.stat-foot .pill')).toHaveText('•••')
  await balance.getByRole('button', { name: 'Hiện số dư', exact: true }).click()
  await expect(balance.locator('.stat-value')).toHaveText(money(4000000))
  await expect(balance.locator('.stat-foot .pill')).toHaveText('100,0%')
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before)
})

for (const hasPreviousMonth of [false, true]) {
  test(`a ${hasPreviousMonth ? 'zero' : 'missing'} balance baseline does not produce a made-up percentage`, async ({
    page,
  }) => {
    await openStats(
      page,
      hasPreviousMonth ? { previousIncome: 2000000, previousExpense: 2000000 } : {},
    )
    await expect(page.locator('.overview-income-card .stat-foot .pill')).toHaveText(
      hasPreviousMonth ? '150,0%' : 'Khoản thu',
    )
    await expect(page.locator('.balance-card .stat-foot .pill')).toHaveText('Trong tháng')
    await expect(page.locator('.balance-card .stat-foot')).not.toContainText('%')
    await expect(page.locator('.stats-grid')).not.toContainText(/NaN|Infinity/)
  })
}

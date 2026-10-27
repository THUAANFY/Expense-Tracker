import { expect, test } from '@playwright/test'
import { createDemoData, dateKey, money } from '../src/data.js'

async function navigateToCategories(page) {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page
    .locator('.sidebar')
    .getByRole('button', { name: 'Danh mục & ngân sách', exact: true })
    .click()
  await expect(page.getByRole('region', { name: 'Tổng quan ngân sách' })).toBeVisible()
}

async function seedCategories(page) {
  const data = createDemoData()
  data.profile.budget = 3000000
  data.budgets = { ...data.budgets, food: 1000000, shopping: 1000000, home: 1000000 }
  const now = new Date()
  const previous = dateKey(new Date(now.getFullYear(), now.getMonth() - 1, 10))
  data.transactions = [
    ['food', 'Chi ăn uống tháng này', 850000, dateKey(), 'expense'],
    ['shopping', 'Mua sắm tháng này', 1200000, dateKey(), 'expense'],
    ['home', 'Tiền nhà tháng này', 1000000, dateKey(), 'expense'],
    ['food', 'Khoản thu không phải chi tiêu', 50000000, dateKey(), 'income'],
    ['food', 'Ăn uống tháng trước', 500000, previous, 'expense'],
  ].map(([category, title, amount, date, type], index) => ({
    id: `budget-test-${index}`,
    category,
    title,
    amount,
    date,
    type,
    note: '',
    wallet: 'Tiền mặt',
    createdAt: Date.now() - index,
  }))
  await page.addInitScript((value) => {
    if (!localStorage.getItem('may-expense-tracker-v1'))
      localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value))
  }, data)
  await page.goto('/')
  await navigateToCategories(page)
}

test('budgets distinguish total limits, exact exhaustion and overspending; filters and sorting use actual expenses', async ({
  page,
}) => {
  await seedCategories(page)
  const overview = page.getByRole('region', { name: 'Tổng quan ngân sách' })
  await expect(overview).toContainText('Đã vượt ngân sách')
  await expect(overview).toContainText(money(50000))
  await expect(overview.locator('.category-limits-total')).toContainText(money(8000000))
  const food = page.getByRole('article', { name: 'Ăn uống', exact: true })
  await expect(food).toContainText('1 giao dịch')
  await expect(food.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '85')
  const home = page.getByRole('article', { name: 'Nhà cửa', exact: true })
  await expect(home).toContainText('Đã dùng hết')
  await expect(home.locator('.budget-category-remaining')).toContainText(money(0))
  const filters = page.getByRole('group', { name: 'Lọc trạng thái ngân sách' })
  const cards = page.locator('.budget-category-card')
  await filters.getByRole('button', { name: /^Gần hạn mức/ }).click()
  await expect(cards).toHaveCount(2)
  await expect(food).toBeVisible()
  await expect(home).toBeVisible()
  await filters.getByRole('button', { name: /^Đã vượt/ }).click()
  await expect(cards).toHaveCount(1)
  await expect(cards).toContainText('Mua sắm')
  await expect(cards.locator('.budget-category-remaining')).toContainText(money(200000))
  await expect(cards.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  await expect(cards.getByRole('progressbar')).toHaveAttribute('aria-valuetext', /120%/)
  await filters.getByRole('button', { name: /^Tất cả/ }).click()
  await page.getByRole('button', { name: 'Sắp xếp theo mức chi', exact: true }).click()
  await expect(cards.first()).toContainText('Mua sắm')
  await page.getByRole('button', { name: 'Điều chỉnh ngân sách tháng', exact: true }).click()
  await expect(page.getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng' })).toHaveValue(
    '3000000',
  )
})

test('budget preview and quick amounts persist without changing the total budget; month links open the right transactions', async ({
  page,
}) => {
  await seedCategories(page)
  await page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống', exact: true }).click()
  const dialog = page.locator('.budget-dialog')
  const input = dialog.getByRole('spinbutton')
  const preview = dialog.getByRole('region', { name: 'Xem trước ngân sách' })
  await input.fill('800000')
  await expect(preview).toContainText('Vượt hạn mức')
  await expect(preview).toContainText(money(50000))
  await dialog.getByRole('button', { name: 'Đặt lại', exact: true }).click()
  await expect(input).toHaveValue('1000000')
  await dialog
    .getByRole('button', { name: `Chọn ngân sách ${money(1200000)}`, exact: true })
    .click()
  await expect(preview).toContainText(money(350000))
  await dialog.getByRole('button', { name: 'Lưu ngân sách', exact: true }).click()
  await page.reload()
  await navigateToCategories(page)
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('may-expense-tracker-v1')),
  )
  expect(stored.budgets.food).toBe(1200000)
  expect(stored.profile.budget).toBe(3000000)
  await expect(
    page.getByRole('article', { name: 'Ăn uống', exact: true }).getByRole('progressbar'),
  ).toHaveAttribute('aria-valuenow', '71')
  await page.getByRole('button', { name: 'Tháng trước', exact: true }).click()
  const food = page.getByRole('article', { name: 'Ăn uống', exact: true })
  await expect(food.locator('.budget-category-spent > strong')).toHaveText(money(500000))
  await expect(food.locator('.budget-category-remaining')).toContainText(money(700000))
  await food.getByRole('button', { name: 'Xem giao dịch Ăn uống', exact: true }).click()
  await expect(page.locator('.transaction-row')).toHaveCount(1)
  await expect(page.locator('.transaction-row')).toContainText('Ăn uống tháng trước')
})

test.describe('small touch screen budgets', () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true })
  test('scrolling budget editor keeps saving reachable and handles empty and large amounts', async ({
    page,
  }) => {
    await seedCategories(page)
    const limitsToggle = page.getByRole('button', {
      name: 'Chi tiết hạn mức danh mục',
      exact: true,
    })
    await expect(limitsToggle).toHaveAttribute('aria-expanded', 'false')
    await limitsToggle.tap()
    await expect(page.locator('.category-limits-status')).toBeVisible()
    await expect(page.locator('.category-limits-status')).toContainText('Đã vượt')
    await limitsToggle.tap()
    await expect(page.locator('.category-limits-status')).not.toBeVisible()
    await page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống', exact: true }).tap()
    const dialog = page.locator('.budget-dialog')
    const input = dialog.getByRole('spinbutton')
    const save = dialog.getByRole('button', { name: 'Lưu ngân sách', exact: true })
    await input.fill('')
    await expect(save).toBeDisabled()
    await input.fill('0')
    await expect(save).toBeDisabled()
    await input.fill('1000000000000')
    await expect(save).toBeEnabled()
    await expect(save).toBeInViewport()
    expect(
      await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBeTruthy()
    await save.tap()
    const card = page.getByRole('article', { name: 'Ăn uống', exact: true })
    await expect(card).toContainText(money(1000000000000))
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
    await page
      .getByRole('group', { name: 'Lọc trạng thái ngân sách' })
      .getByRole('button', { name: /^Đã vượt/ })
      .tap()
    await page
      .getByRole('article', { name: 'Mua sắm', exact: true })
      .getByRole('button', { name: 'Chỉnh ngân sách Mua sắm', exact: true })
      .tap()
    await dialog.getByRole('spinbutton').fill('2000000')
    await save.tap()
    await expect(
      page.getByRole('heading', { name: 'Chưa có danh mục vượt hạn mức', exact: true }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Xem tất cả danh mục', exact: true }).tap()
    await expect(page.locator('.budget-category-card')).toHaveCount(8)
  })
})

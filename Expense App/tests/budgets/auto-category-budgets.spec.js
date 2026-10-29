import { expect, test } from '@playwright/test'
import {
  createEmptyData,
  dateKey,
  isValidData,
  money,
  monthKey,
  STORAGE_KEY,
} from '../../src/shared/storage/data.js'
import {
  allocateCategoryBudget,
  CATEGORY_BUDGET_WEIGHTS,
  createCategoryBudgetPolicy,
  getAutomaticCategoryBudget,
  getCategoryBudgetPlan,
  getCategoryBudgets,
} from '../../src/features/budgets/categoryBudgets.js'
import { closedMonthChangeError } from '../../src/shared/lib/closedMonths.js'
import { buildNotifications } from '../../src/features/notifications/notifications.js'

const month = monthKey()
const now = new Date()
const previous = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
const next = monthKey(new Date(now.getFullYear(), now.getMonth() + 1, 1))
const sum = (budgets) => Object.values(budgets).reduce((total, amount) => total + amount, 0)
function book() {
  const data = createEmptyData()
  data.profile.budget = 2000000
  data.monthlyBudgets = { [month]: 2000000 }
  data.moneySources = [
    {
      id: 'cash',
      name: 'Ví của tôi',
      type: 'cash',
      color: 'mint',
      openingBalance: 20000000,
      openingDate: `${month}-01`,
      createdAt: Date.now(),
    },
  ]
  return data
}
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
async function navigate(page, name = 'Danh mục & ngân sách') {
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name, exact: true }).click()
}
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)
const card = (page, name = 'Ăn uống') => page.getByRole('article', { name, exact: true })
async function editFood(page) {
  await page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống', exact: true }).click()
  return page.locator('.budget-dialog')
}
async function saveManual(page, amount) {
  const dialog = await editFood(page)
  await dialog.getByRole('spinbutton').fill(String(amount))
  await dialog.getByRole('button', { name: 'Lưu ngân sách', exact: true }).click()
  await expect(dialog).not.toBeVisible()
}

test('suggested ratios follow each month and allocate exactly even for tiny and maximum amounts', () => {
  const data = book()
  for (const total of [1, 2, 3, 7, 99, 101, 1234567, 10000000, 999999999999, 1e12]) {
    data.monthlyBudgets[month] = total
    const budgets = getCategoryBudgets(data, month)
    expect(sum(budgets)).toBe(total)
    for (const [id, weight] of Object.entries(CATEGORY_BUDGET_WEIGHTS)) {
      expect(Number.isSafeInteger(budgets[id])).toBeTruthy()
      expect(budgets[id]).toBeGreaterThanOrEqual(0)
      expect(Math.abs(budgets[id] - (total * weight) / 100)).toBeLessThan(1)
    }
  }
  expect(getCategoryBudgets({ ...data, monthlyBudgets: { [month]: 10000000 } }, month)).toEqual({
    food: 2500000,
    shopping: 1000000,
    transport: 1000000,
    home: 3000000,
    fun: 800000,
    health: 700000,
    study: 500000,
    other: 500000,
  })
  data.monthlyBudgets[next] = 5000000
  expect(getCategoryBudgets(data, next).food).toBe(1250000)
  expect(getCategoryBudgets(data, previous)).toEqual(data.budgets)
})

test('manual limits reserve money first, zero is valid, and excess or unallocated amounts stay explicit', () => {
  const data = book()
  data.monthlyCategoryBudgets = { [month]: { food: 800000 } }
  let plan = getCategoryBudgetPlan(data, month)
  expect(plan.budgets.food).toBe(800000)
  expect(plan.budgets.home).toBe(480000)
  expect(sum(plan.budgets)).toBe(2000000)
  expect(getAutomaticCategoryBudget(data, month, 'food')).toBe(500000)
  data.monthlyBudgets[month] = 3000000
  plan = getCategoryBudgetPlan(data, month)
  expect(plan.budgets.food).toBe(800000)
  expect(plan.budgets.home).toBe(880000)
  data.monthlyCategoryBudgets[month].food = 0
  expect(isValidData(data)).toBeTruthy()
  expect(sum(getCategoryBudgets(data, month))).toBe(3000000)
  data.monthlyCategoryBudgets[month].food = 4000000
  plan = getCategoryBudgetPlan(data, month)
  expect(plan.excess).toBe(1000000)
  expect(plan.budgets.home).toBe(0)
  expect(plan.budgets.food).toBe(4000000)
  data.monthlyCategoryBudgets[month] = Object.fromEntries(
    Object.keys(data.budgets).map((id) => [id, 100000]),
  )
  expect(getCategoryBudgetPlan(data, month).unallocated).toBe(2200000)
  expect(allocateCategoryBudget(100, {})).toEqual({})
})

test('the recorded policy keeps both legacy and automatic history stable after month rollover and backup round trips', () => {
  const data = book()
  data.monthlyCategoryBudgets = { [previous]: { food: 123456 }, [month]: { food: 800000 } }
  const historic = getCategoryBudgets(data, previous)
  const automatic = getCategoryBudgets(data, month)
  const restored = JSON.parse(JSON.stringify(data))
  expect(isValidData(restored)).toBeTruthy()
  restored.monthlyBudgets[next] = 7000000
  expect(getCategoryBudgets(restored, previous)).toEqual(historic)
  expect(getCategoryBudgets(restored, month)).toEqual(automatic)
  expect(closedMonthChangeError(data, restored, next)).toBe('')
  const changed = structuredClone(restored)
  changed.monthlyBudgets[month]++
  expect(closedMonthChangeError(restored, changed, next)).toContain('chỉ được xem')
  for (const policy of [
    undefined,
    createCategoryBudgetPolicy(next),
    { ...data.categoryBudgetPolicy, weights: { ...CATEGORY_BUDGET_WEIGHTS, food: 24, home: 31 } },
  ]) {
    expect(
      closedMonthChangeError(data, { ...data, categoryBudgetPolicy: policy }, next),
    ).toBeTruthy()
  }
  const legacy = { ...data }
  delete legacy.categoryBudgetPolicy
  expect(isValidData(legacy)).toBeTruthy()
  expect(
    closedMonthChangeError(
      legacy,
      { ...legacy, categoryBudgetPolicy: createCategoryBudgetPolicy(previous) },
      month,
    ),
  ).toBeTruthy()
  for (const policy of [
    null,
    {},
    { ...data.categoryBudgetPolicy, fromMonth: '2026-13' },
    { ...data.categoryBudgetPolicy, weights: { ...CATEGORY_BUDGET_WEIGHTS, food: 26 } },
    { ...data.categoryBudgetPolicy, weights: { ...CATEGORY_BUDGET_WEIGHTS, extra: 1 } },
  ]) {
    expect(isValidData({ ...data, categoryBudgetPolicy: policy })).toBeFalsy()
  }
})

test('existing books adopt automatic limits with metadata only and keep all historical records', async ({
  page,
}) => {
  const legacy = book()
  delete legacy.categoryBudgetPolicy
  legacy.monthlyCategoryBudgets = { [previous]: { food: 123456 }, [month]: { shopping: 400000 } }
  legacy.transactions = [
    {
      id: 'old',
      title: 'Khoản cũ',
      amount: 12345,
      category: 'food',
      type: 'expense',
      date: `${previous}-05`,
      createdAt: Date.now(),
      note: 'Giữ nguyên',
      wallet: 'Tiền mặt',
    },
  ]
  await seed(page, legacy)
  await expect
    .poll(async () => (await stored(page)).categoryBudgetPolicy)
    .toEqual(createCategoryBudgetPolicy())
  const migrated = await stored(page)
  const { categoryBudgetPolicy, ...unchanged } = migrated
  expect(unchanged).toEqual(legacy)
  expect(getCategoryBudgets(migrated, previous)).toEqual({ ...legacy.budgets, food: 123456 })
  expect(sum(getCategoryBudgets(migrated, month))).toBe(2000000)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await stored(page)).toEqual({ ...unchanged, categoryBudgetPolicy })
})

test('a failed legacy adoption leaves the original book intact and reports the storage error', async ({
  page,
}) => {
  const legacy = book()
  delete legacy.categoryBudgetPolicy
  const raw = JSON.stringify(legacy)
  await page.addInitScript(
    ({ key, raw }) => {
      localStorage.setItem(key, raw)
      const write = Storage.prototype.setItem
      Storage.prototype.setItem = function (name, value) {
        if (name === key) throw new DOMException('Full', 'QuotaExceededError')
        return write.call(this, name, value)
      }
    },
    { key: STORAGE_KEY, raw },
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.storage-alert')).toContainText('Không thể lưu')
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(raw)
})

for (const width of [320, 1440])
  test(`automatic and manual limits update, reset, and persist at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 320 ? 740 : 1080 })
    await seed(page)
    await navigate(page)
    await expect(card(page).locator('.budget-category-limit')).toContainText(money(500000))
    await expect(card(page)).toContainText('Tự động')
    await saveManual(page, 800000)
    await expect(card(page)).toContainText('Đặt riêng')
    await expect(card(page, 'Nhà cửa').locator('.budget-category-limit')).toContainText(
      money(480000),
    )
    await navigate(page, 'Cài đặt')
    await page
      .getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng', exact: false })
      .fill('3000000')
    await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
    await expect.poll(async () => (await stored(page)).monthlyBudgets[month]).toBe(3000000)
    await navigate(page)
    await expect(card(page).locator('.budget-category-limit')).toContainText(money(800000))
    await expect(card(page, 'Nhà cửa').locator('.budget-category-limit')).toContainText(
      money(880000),
    )
    const dialog = await editFood(page)
    await dialog.getByRole('button', { name: /^Dùng mức tự động/ }).click()
    await expect(dialog.getByRole('spinbutton')).toHaveValue('750000')
    await dialog.getByRole('button', { name: 'Lưu ngân sách', exact: true }).click()
    await expect(dialog).not.toBeVisible()
    expect((await stored(page)).monthlyCategoryBudgets[month].food).toBeUndefined()
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await navigate(page)
    await expect(card(page)).toContainText('Tự động')
    await expect(card(page).locator('.budget-category-limit')).toContainText(money(750000))
    await saveManual(page, 4000000)
    await expect(page.locator('.category-allocation-note')).toContainText(
      'vượt ngân sách tháng 1.000.000',
    )
    await expect(card(page, 'Nhà cửa').getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    )
    await page.getByRole('button', { name: 'Dùng tỷ lệ tự động', exact: true }).click()
    await expect.poll(async () => (await stored(page)).monthlyCategoryBudgets[month]).toEqual({})
    await expect(card(page, 'Nhà cửa').locator('.budget-category-limit')).toContainText(
      money(900000),
    )
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })

test('zero limits are empty until spending occurs, then both the card and notifications show overspending', async ({
  page,
}) => {
  const data = book()
  data.monthlyBudgets[month] = 1
  data.transactions = [
    {
      id: 'tiny',
      title: 'Khoản nhỏ',
      type: 'expense',
      category: 'food',
      amount: 1,
      date: dateKey(),
      wallet: 'Tiền mặt',
      note: '',
      createdAt: Date.now(),
    },
  ]
  const notices = buildNotifications(data, { remindersEnabled: false })
  expect(notices.find((item) => item.category === 'food').title).toContain('vượt hạn mức')
  expect(notices.some((item) => item.category === 'shopping')).toBeFalsy()
  await seed(page, data)
  await navigate(page)
  await expect(card(page)).toContainText('Vượt hạn mức')
  await expect(card(page).getByRole('progressbar')).toHaveAttribute(
    'aria-valuetext',
    `Hạn mức 0 ₫ — đã chi ${money(1)}`,
  )
  await expect(card(page, 'Mua sắm')).toContainText('Chưa phát sinh')
  await expect(page.locator('.category-limits-distribution > span')).toHaveCount(1)
  await expect(page.locator('.categories-workspace')).not.toContainText(/NaN|Infinity/)
  const dialog = await editFood(page)
  await expect(dialog.getByRole('spinbutton')).toHaveValue('0')
  await expect(dialog.getByRole('button', { name: 'Lưu ngân sách', exact: true })).toBeEnabled()
})

test('concurrent monthly and manual changes merge before allocation; recorded policies cannot be rewritten', async ({
  page,
}) => {
  await seed(page)
  const result = await page.evaluate(
    async ({ key, month }) => {
      const { persistBook } = await import('/src/shared/storage/bookStorage.js')
      const { getCategoryBudgetPlan } = await import('/src/features/budgets/categoryBudgets.js')
      const raw = localStorage.getItem(key),
        base = JSON.parse(raw)
      await Promise.all([
        persistBook(
          base,
          { ...base, monthlyCategoryBudgets: { [month]: { food: 800000 } } },
          { baseRaw: raw },
        ),
        persistBook(
          base,
          { ...base, monthlyCategoryBudgets: { [month]: { shopping: 500000 } } },
          { baseRaw: raw },
        ),
        persistBook(base, { ...base, monthlyBudgets: { [month]: 3000000 } }, { baseRaw: raw }),
      ])
      const saved = JSON.parse(localStorage.getItem(key))
      let errorCode
      try {
        await persistBook(
          saved,
          {
            ...saved,
            categoryBudgetPolicy: { ...saved.categoryBudgetPolicy, fromMonth: '2020-01' },
          },
          { baseRaw: JSON.stringify(saved) },
        )
      } catch (error) {
        errorCode = error.code
      }
      return { saved, plan: getCategoryBudgetPlan(saved, month), errorCode }
    },
    { key: STORAGE_KEY, month },
  )
  expect(result.saved.monthlyCategoryBudgets[month]).toEqual({ food: 800000, shopping: 500000 })
  expect(result.plan.total).toBe(3000000)
  expect(sum(result.plan.budgets)).toBe(3000000)
  expect(result.plan.budgets.food).toBe(800000)
  expect(result.errorCode).toBe('closed-month')
})

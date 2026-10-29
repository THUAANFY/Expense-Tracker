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
  CATEGORY_BUDGET_WEIGHTS,
  getCategoryBudgets,
  getCategoryBudgetPlan,
  getCategoryBudgetWeights,
} from '../../src/features/budgets/categoryBudgets.js'
import { closedMonthChangeError } from '../../src/shared/lib/closedMonths.js'
import { buildNotifications } from '../../src/features/notifications/notifications.js'
import { selectMonth } from '../helpers/month-picker.js'

const month = monthKey()
const now = new Date()
const previous = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
const next = monthKey(new Date(now.getFullYear(), now.getMonth() + 1, 1))
const later = monthKey(new Date(now.getFullYear(), now.getMonth() + 2, 1))
const ratios = (food = 30) => ({ ...CATEGORY_BUDGET_WEIGHTS, food, home: 55 - food })
function book() {
  const data = createEmptyData()
  data.monthlyBudgets = { [month]: 2000000, [next]: 3000000 }
  return data
}
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)
const form = (page) => page.getByRole('form', { name: 'Tỷ lệ phân bổ danh mục', exact: true })
const input = (page, name = 'Ăn uống') =>
  form(page).getByRole('spinbutton', { name: `Tỷ lệ ${name}`, exact: true })
const save = (page) => form(page).getByRole('button', { name: 'Lưu tỷ lệ', exact: true })
async function ready(page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
async function navigate(page, name = 'Cài đặt') {
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name, exact: true }).click()
}
async function seed(page, data = book()) {
  await page.addInitScript(
    ({ key, data }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, data },
  )
  await ready(page)
  await navigate(page)
}
async function setRatios(page, food = 30) {
  await input(page).fill(String(food))
  await input(page, 'Nhà cửa').fill(String(55 - food))
}

test('ratio schedules validate full category maps, whole percentages, and dates while old backups stay valid', () => {
  const data = book()
  expect(isValidData(data)).toBeTruthy()
  const tiny = {
    ...data,
    monthlyBudgets: { [month]: 10 },
    monthlyCategoryWeights: { [month]: { ...CATEGORY_BUDGET_WEIGHTS } },
  }
  const beforeReorder = getCategoryBudgets(tiny, month)
  tiny.monthlyCategoryWeights[month] = Object.fromEntries(
    Object.entries(CATEGORY_BUDGET_WEIGHTS).reverse(),
  )
  expect(getCategoryBudgets(tiny, month)).toEqual(beforeReorder)
  const allFood = Object.fromEntries(
    Object.keys(CATEGORY_BUDGET_WEIGHTS).map((id) => [id, id === 'food' ? 100 : 0]),
  )
  expect(isValidData({ ...data, monthlyCategoryWeights: { [month]: allFood } })).toBeTruthy()
  expect(
    isValidData(
      JSON.parse(JSON.stringify({ ...data, monthlyCategoryWeights: { [month]: ratios() } })),
    ),
  ).toBeTruthy()
  for (const invalid of [
    null,
    [],
    { '2026-13': ratios() },
    { '1899-12': ratios() },
    { [month]: null },
    { [month]: { food: 100 } },
    { [month]: { ...ratios(), food: 29 } },
    { [month]: { ...ratios(), food: -1, home: 56 } },
    { [month]: { ...ratios(), food: 30.5, home: 24.5 } },
    { [month]: { ...ratios(), other: '5' } },
    { [month]: { ...ratios(), extra: 0 } },
  ])
    expect(isValidData({ ...data, monthlyCategoryWeights: invalid })).toBeFalsy()
})

test('ratios carry forward until the next saved schedule without changing earlier history or manual amounts', () => {
  const data = book()
  const history = getCategoryBudgets(data, previous)
  data.monthlyCategoryWeights = { [month]: ratios(30), [later]: ratios(40) }
  expect(getCategoryBudgetWeights(data, next)).toEqual(ratios(30))
  expect(getCategoryBudgetWeights(data, later)).toEqual(ratios(40))
  expect(getCategoryBudgets(data, month).food).toBe(600000)
  expect(getCategoryBudgets(data, next).food).toBe(900000)
  expect(getCategoryBudgets(data, previous)).toEqual(history)
  const before = structuredClone(data)
  data.monthlyCategoryWeights[next] = ratios(35)
  expect(closedMonthChangeError(before, data, month)).toBe('')
  expect(getCategoryBudgets(data, month).food).toBe(600000)
  for (const change of [
    (d) => {
      d.monthlyCategoryWeights[month] = ratios(40)
    },
    (d) => {
      delete d.monthlyCategoryWeights[month]
    },
  ]) {
    const changed = structuredClone(data)
    change(changed)
    expect(closedMonthChangeError(data, changed, next)).toContain('chỉ được xem')
  }
  data.monthlyCategoryBudgets = { [month]: { food: 800000 } }
  const plan = getCategoryBudgetPlan(data, month)
  expect(plan.budgets.food).toBe(800000)
  expect(Object.values(plan.budgets).reduce((sum, amount) => sum + amount, 0)).toBe(2000000)
  data.monthlyCategoryWeights[month] = Object.fromEntries(
    Object.keys(CATEGORY_BUDGET_WEIGHTS).map((id) => [id, id === 'food' ? 100 : 0]),
  )
  expect(getCategoryBudgetPlan(data, month).unallocated).toBe(1200000)
  expect(Object.values(getCategoryBudgets(data, month)).every(Number.isFinite)).toBeTruthy()
})

test('notification thresholds use the adjusted ratios', () => {
  const data = book()
  data.transactions = [
    {
      id: 'lunch',
      title: 'Bữa trưa',
      type: 'expense',
      category: 'food',
      amount: 700000,
      date: dateKey(),
      createdAt: Date.now(),
      note: '',
      wallet: 'Tiền mặt',
    },
  ]
  expect(
    buildNotifications(data, { remindersEnabled: false }).find((item) => item.category === 'food')
      .title,
  ).toContain('vượt hạn mức')
  data.monthlyCategoryWeights = { [month]: ratios(40) }
  const notice = buildNotifications(data, { remindersEnabled: false }).find(
    (item) => item.category === 'food',
  )
  expect(notice.title).toContain('sắp chạm ngân sách')
  expect(notice.description).toContain('87,5%')
})

for (const width of [320, 1440])
  test(`ratios validate, preview, save and reset without changing manual limits at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 320 ? 740 : 1000 })
    await seed(page)
    const before = await stored(page)
    await input(page).fill('24')
    await expect(form(page).getByRole('status')).toContainText('Còn thiếu 1%')
    await expect(save(page)).toBeDisabled()
    await input(page).fill('26')
    await expect(form(page).getByRole('status')).toContainText('Đang dư 1%')
    await expect(save(page)).toBeDisabled()
    await input(page).fill('')
    await expect(save(page)).toBeDisabled()
    await input(page).fill('25.5')
    await input(page, 'Nhà cửa').fill('29.5')
    await expect(form(page).getByRole('status')).toContainText('số nguyên')
    await expect(save(page)).toBeDisabled()
    expect(await stored(page)).toEqual(before)
    await setRatios(page)
    await expect(form(page).locator('.settings-ratio-row').first()).toContainText(money(600000))
    await expect(save(page)).toBeEnabled()
    await save(page).click()
    await expect
      .poll(async () => (await stored(page)).monthlyCategoryWeights?.[month])
      .toEqual(ratios())
    expect((await stored(page)).monthlyBudgets).toEqual(before.monthlyBudgets)
    await navigate(page, 'Danh mục & ngân sách')
    await expect(
      page.getByRole('article', { name: 'Ăn uống', exact: true }).locator('.budget-category-limit'),
    ).toContainText(money(600000))
    await ready(page)
    await navigate(page)
    await expect(input(page)).toHaveValue('30')
    await form(page).getByRole('button', { name: 'Tỷ lệ ban đầu', exact: true }).click()
    await expect(input(page)).toHaveValue('25')
    await save(page).click()
    await expect
      .poll(async () => (await stored(page)).monthlyCategoryWeights?.[month])
      .toEqual(CATEGORY_BUDGET_WEIGHTS)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })

test('month drafts survive navigation and past schedules remain read-only after rollover', async ({
  page,
}) => {
  const data = book()
  data.categoryBudgetPolicy.fromMonth = previous
  data.monthlyCategoryWeights = { [previous]: ratios(40) }
  await seed(page, data)
  await setRatios(page, 30)
  await selectMonth(page, next, 'Chọn tháng ngân sách')
  await expect(input(page)).toHaveValue('40')
  await setRatios(page, 35)
  await selectMonth(page, month, 'Chọn tháng ngân sách')
  await expect(input(page)).toHaveValue('30')
  await save(page).click()
  await selectMonth(page, next, 'Chọn tháng ngân sách')
  await expect(input(page)).toHaveValue('35')
  await save(page).click()
  await expect
    .poll(async () => (await stored(page)).monthlyCategoryWeights?.[next])
    .toEqual(ratios(35))
  await selectMonth(page, previous, 'Chọn tháng ngân sách')
  await expect(input(page)).toHaveValue('40')
  await expect(input(page)).toHaveAttribute('readonly', '')
  await expect(save(page)).toBeDisabled()
  const before = await stored(page)
  const code = await page.evaluate(
    async ({ key, month }) => {
      const { persistBook } = await import('/src/shared/storage/bookStorage.js')
      const raw = localStorage.getItem(key),
        base = JSON.parse(raw)
      try {
        await persistBook(base, { ...base, monthlyCategoryWeights: {} }, { baseRaw: raw })
        return ''
      } catch (error) {
        return error.code
      }
    },
    { key: STORAGE_KEY, month },
  )
  expect(code).toBe('closed-month')
  expect(await stored(page)).toEqual(before)
})

test('stale ratio edits cannot overwrite another tab and retain their draft', async ({
  page,
  context,
}) => {
  await seed(page)
  await setRatios(page, 30)
  const other = await context.newPage()
  await ready(other)
  await navigate(other)
  await setRatios(other, 40)
  await save(other).click()
  await expect
    .poll(async () => (await stored(page)).monthlyCategoryWeights?.[month])
    .toEqual(ratios(40))
  await expect(input(page)).toHaveValue('30')
  await save(page).click()
  await expect(page.locator('.storage-alert')).toContainText('tab khác')
  await expect(input(page)).toHaveValue('30')
  expect((await stored(page)).monthlyCategoryWeights[month]).toEqual(ratios(40))
})

test('a failed ratio save retains the draft and original bytes', async ({ page }) => {
  await seed(page)
  const before = await stored(page)
  await page.evaluate((key) => {
    const write = Storage.prototype.setItem
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Full', 'QuotaExceededError')
      return write.call(this, name, value)
    }
  }, STORAGE_KEY)
  await setRatios(page, 30)
  await save(page).click()
  await expect(form(page).getByRole('alert')).toContainText('Bản nháp vẫn được giữ')
  await expect(input(page)).toHaveValue('30')
  expect(await stored(page)).toEqual(before)
})

test('zero percentages save with manual limits preserved and the remaining money clearly unallocated', async ({
  page,
}) => {
  const data = book()
  data.monthlyCategoryBudgets = { [month]: { food: 800000 } }
  await seed(page, data)
  for (const category of [
    'Ăn uống',
    'Mua sắm',
    'Di chuyển',
    'Nhà cửa',
    'Giải trí',
    'Sức khỏe',
    'Học tập',
    'Khác',
  ])
    await input(page, category).fill(category === 'Ăn uống' ? '100' : '0')
  await expect(form(page).locator('.settings-ratio-row').first()).toContainText('Đặt riêng')
  await expect(form(page).locator('.settings-ratios-warning')).toContainText('1.200.000')
  await expect(save(page)).toBeEnabled()
  await save(page).click()
  await expect
    .poll(async () => (await stored(page)).monthlyCategoryWeights?.[month]?.food)
    .toBe(100)
  expect((await stored(page)).monthlyCategoryBudgets).toEqual(data.monthlyCategoryBudgets)
  expect(getCategoryBudgetPlan(await stored(page), month).unallocated).toBe(1200000)
})

test('concurrent schedules for different months merge and preserve the next scheduled change', async ({
  page,
}) => {
  await seed(page)
  const data = await page.evaluate(
    async ({ key, month, next, weights, laterWeights }) => {
      const { persistBook } = await import('/src/shared/storage/bookStorage.js')
      const raw = localStorage.getItem(key),
        base = JSON.parse(raw)
      await Promise.all([
        persistBook(
          base,
          { ...base, monthlyCategoryWeights: { [month]: weights } },
          { baseRaw: raw },
        ),
        persistBook(
          base,
          { ...base, monthlyCategoryWeights: { [next]: laterWeights } },
          { baseRaw: raw },
        ),
      ])
      return JSON.parse(localStorage.getItem(key))
    },
    { key: STORAGE_KEY, month, next, weights: ratios(30), laterWeights: ratios(40) },
  )
  expect(data.monthlyCategoryWeights).toEqual({ [month]: ratios(30), [next]: ratios(40) })
  expect(getCategoryBudgets(data, month).food).toBe(600000)
  expect(getCategoryBudgets(data, next).food).toBe(1200000)
})

test('saving inherited ratios pins a future month before the current month changes', async ({
  page,
}) => {
  await seed(page)
  await selectMonth(page, next, 'Chọn tháng ngân sách')
  await expect(input(page)).toHaveValue('25')
  await expect(save(page)).toBeEnabled()
  await save(page).click()
  await expect
    .poll(async () => (await stored(page)).monthlyCategoryWeights?.[next])
    .toEqual(CATEGORY_BUDGET_WEIGHTS)
  await selectMonth(page, month, 'Chọn tháng ngân sách')
  await setRatios(page, 30)
  await save(page).click()
  await expect
    .poll(async () => (await stored(page)).monthlyCategoryWeights?.[month])
    .toEqual(ratios(30))
  await selectMonth(page, next, 'Chọn tháng ngân sách')
  await expect(input(page)).toHaveValue('25')
  await expect(save(page)).toBeDisabled()
})
